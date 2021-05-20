import * as fs from "fs";
import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";

export interface AssemblyFetcher {
  fetchAssembly(name: string, version: string): spec.Assembly;
}

export class ApiReference {
  private readonly ts: reflect.TypeSystem;
  private readonly constructs: reflect.ClassType[];
  private readonly structs: reflect.InterfaceType[];
  private readonly assemblyFetcher: AssemblyFetcher;

  constructor(
    private readonly assemblyName: string,
    assemblyVersion: string,
    fetcher: AssemblyFetcher,
    submodule?: string
  ) {
    this.ts = new reflect.TypeSystem();
    this.assemblyFetcher = fetcher;

    const assemblies = this.fetchAssemblies(assemblyName, assemblyVersion);

    for (const assembly of assemblies) {
      this.ts.addAssembly(new reflect.Assembly(this.ts, assembly));
    }
    this.constructs = this.ts.classes
      .filter((c) => this.isConstruct(c))
      .filter((c) => (submodule ? this.inSubmodule(c, submodule) : true));
    this.structs = this.ts.interfaces
      .filter((i) => i.datatype)
      .filter((i) => (submodule ? this.inSubmodule(i, submodule) : true));
  }

  private inSubmodule(type: reflect.ReferenceType, submodule: string): boolean {
    return type.fqn.startsWith(submodule);
  }

  public fetchAssemblies(name: string, version: string): spec.Assembly[] {
    const assemblies: spec.Assembly[] = new Array<spec.Assembly>();

    const fetcher = this.assemblyFetcher;
    function recurse(_name: string, _version: string) {
      const assembly = fetcher.fetchAssembly(_name, _version);
      assemblies.push(assembly);
      for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
        recurse(d, v);
      }
    }

    recurse(name, version);
    return assemblies;
  }

  public isConstruct(klass: reflect.ClassType): boolean {
    if (klass.fqn === "constructs.Construct") return true;

    if (!klass.base) {
      return false;
    }

    return this.isConstruct(klass.base);
  }

  public get pythonMarkdown(): string {
    const assembly = this.ts.findAssembly(this.assemblyName);
    if (!assembly.targets?.python) {
      throw new Error(`Python target not found for assembly: ${assembly.name}`);
    }

    const lines = new Array<string>();

    if (this.constructs.length > 0) {
      lines.push("# Constructs");
      lines.push("");
      for (const construct of this.constructs) {
        lines.push(...new PythonClass(construct).markdown);
      }
    }

    if (this.structs.length > 0) {
      lines.push("# Structs");
      lines.push("");
      for (const struct of this.structs) {
        lines.push(...new PythonStruct(struct).markdown);
      }
    }

    return lines.join("\n");
  }
}

export class PythonClass {
  constructor(private readonly klass: reflect.ClassType) {}
  public get markdown(): string[] {
    const lines = new Array<string>();

    lines.push(`<h2 id="${this.klass.fqn}">${this.klass.name}</h2>`);
    // lines.push(`## \`${this.klass.name}\` <a id="${this.klass.fqn}"></a>`);
    lines.push("");

    if (this.klass.docs.summary) {
      lines.push(this.klass.docs.summary);
      lines.push("");
    }

    if (this.klass.docs.remarks) {
      lines.push(this.klass.docs.remarks);
      lines.push("");
    }

    if (this.klass.docs.link) {
      lines.push(`See ${this.klass.docs.link}`);
    }

    if (this.klass.initializer) {
      lines.push(
        ...new PythonClassInitializer(this.klass.initializer).markdown
      );
    }
    return lines;
  }
}

export class PythonStruct {
  constructor(private readonly iface: reflect.InterfaceType) {}
  public get markdown(): string[] {
    const lines = new Array<string>();

    lines.push(`## \`${this.iface.name}\` <a id="${this.iface.fqn}"></a>`);
    lines.push("");

    if (this.iface.docs.summary) {
      lines.push(this.iface.docs.summary);
      lines.push("");
    }

    if (this.iface.docs.remarks) {
      lines.push(this.iface.docs.remarks);
      lines.push("");
    }

    if (this.iface.docs.link) {
      lines.push(`See ${this.iface.docs.link}`);
      lines.push("");
    }

    return lines;
  }
}

export class PythonClassInitializer {
  constructor(private readonly initializer: reflect.Initializer) {}

  public isStruct(parameter: reflect.Parameter): boolean {
    const named = spec.isNamedTypeReference(parameter.spec.type);
    if (!named) {
      return false;
    }

    if (!parameter.type.fqn) {
      throw new Error(
        `Parameter '${parameter.name}' for initializer '${this.initializer.name} has no FQN'`
      );
    }
    return parameter.system.findFqn(parameter.type.fqn).isDataType();
  }

  public get markdown(): string[] {
    const lines = new Array<string>();
    lines.push("### Initializer");
    lines.push("");

    const module = this.findImport();

    const nonStructParameters = this.initializer.parameters.filter(
      (p) => !this.isStruct(p)
    );

    const structParameters = this.initializer.parameters.filter((p) =>
      this.isStruct(p)
    );

    const positional =
      nonStructParameters.length > 0
        ? `${nonStructParameters
            .map((p) => `${p.name}: ${p.type}`)
            .join(", ")}, `
        : "";

    const kwargs = structParameters.length > 0 ? "**kwargs" : "";

    lines.push(
      ...[
        "```python",
        `import ${module}`,
        "",
        `${module}.${this.initializer.parentType.name}(${positional}${kwargs})`,
        "```",
        "",
      ]
    );

    if (kwargs) {
      lines.push("#### kwargs");
      lines.push("");
      for (const parameter of structParameters) {
        if (!parameter.type.fqn) {
          throw new Error("asdasd");
        }

        const struct = this.initializer.system.findInterface(
          parameter.type.fqn
        );
        for (const property of struct.allProperties) {
          lines.push(...new PythonArgument(property).markdown);
          lines.push("");
          lines.push("---");
          lines.push("");
        }
      }
    }

    return lines;
  }

  private findImport() {
    const submodules = this.initializer.assembly.submodules;

    const prefix = this.initializer.parentType.fqn
      .split(".")
      .slice(0, -1)
      .join(".");

    const submodule: reflect.Submodule | undefined = submodules.filter((s) => {
      return s.fqn === prefix;
    })[0];

    if (submodule) {
      if (!submodule.targets) {
        throw new Error(`No targets: ${submodule.fqn}`);
      }
      return submodule.targets!.python?.module;
    }

    return this.initializer.assembly.targets!.python?.module;
  }
}

export class PythonClassMethods {}

export class PythonClassProperties {}

export class PythonClassStaticMembers {}

export class PythonClassProperty {}

export class PythonArgument {
  constructor(
    private readonly argument: reflect.Parameter | reflect.Property
  ) {}

  public get markdown(): string[] {
    let title = `##### \`${this.argument.name}\``;
    const docs = [];

    if (this.argument.docs.summary) {
      docs.push(this.argument.docs.summary);
      docs.push("");
    }
    if (this.argument.docs.remarks) {
      docs.push(`> ${this.argument.docs.remarks}`);
      docs.push("");
    }

    const metadata = [
      `- *Type: ${this.link(this.argument.type)} | **${
        this.argument.optional ? "Optional" : "Required"
      }** | Default: ${this.argument.spec.docs?.default}*`,
    ];

    if (this.argument.docs.deprecated) {
      title = `~~${title}~~`;
      metadata.push(`- *Depracated: ${this.argument.docs.deprecationReason}`);
    }

    return [title, "", ...metadata, "", ...docs];
  }

  private link(type: reflect.TypeReference): string {
    if (spec.isNamedTypeReference(type.spec)) {
      return `[${type.toString()}](#${type.fqn})`;
    }

    if (spec.isUnionTypeReference(type.spec)) {
      const types = type.unionOfTypes!;
      return types
        .map((t) => {
          return `[${t.toString()}](#${t.fqn})`;
        })
        .join(" | ");
    }

    return type.toString();
  }
}

test("basic", () => {
  const fetcher = new AssemblyFetcherForTests();
  const reference = new ApiReference(
    "aws-cdk-lib",
    "2.0.0-rc4",
    fetcher,
    "aws-cdk-lib.aws_eks"
  );

  fs.writeFileSync(`${__dirname}/readme.md`, reference.pythonMarkdown);
  // expect(reference.pythonMarkdown).toMatchSnapshot();
});

export class AssemblyFetcherForTests implements AssemblyFetcher {
  public fetchAssembly(name: string, version: string): spec.Assembly {
    if (version.startsWith("^")) {
      version = version.substring(1, version.length);
    }
    const assembly = fs
      .readFileSync(
        `${__dirname}/../test/resources/jsii-assemblies/${name}-${version}.json`,
        {
          encoding: "utf8",
        }
      )
      .toString();

    return JSON.parse(assembly) as spec.Assembly;
  }
}
