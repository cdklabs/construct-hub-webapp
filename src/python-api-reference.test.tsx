import * as fs from "fs";
import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";

function inSubmodule(type: reflect.ReferenceType, submodule: string): boolean {
  return type.fqn.startsWith(submodule);
}

export interface AssemblyFetcher {
  fetchAssembly(name: string, version: string): spec.Assembly;
}

export class Markdown {
  private readonly _lines = new Array<string>();

  public readonly headerSize: number;

  constructor(
    public readonly title: string,
    headerSize?: number,
    public readonly id?: string,
    code?: boolean,
    deprecated?: boolean
  ) {
    this.headerSize = headerSize ?? 1;

    if (this.headerSize > 6) {
      throw new Error(
        `Unable to create markdown '${this.title}': Header limit reached`
      );
    }

    let caption = this.title;

    if (code) {
      caption = `\`${title}\``;
    }

    if (deprecated) {
      caption = `~~${title}~~`;
    }
    const heading = "#".repeat(this.headerSize);
    this.lines(`${heading} ${caption} <a name="${id ?? this.title}"></a>`);
  }

  public lines(...lines: string[]) {
    this._lines.push(...lines);
    this._lines.push("");
  }

  public sections(...sections: Markdown[]) {
    for (const section of sections) {
      this.lines(section.toString());
    }
  }

  public toString() {
    return this._lines.join("\n");
  }
}

export class ApiReference {
  private readonly ts: reflect.TypeSystem;
  private readonly constructs: Constructs;
  private readonly structs: Structs;
  private readonly assemblyFetcher: AssemblyFetcher;
  private reference: Markdown;

  constructor(
    assemblyName: string,
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

    this.reference = new Markdown("API Reference");

    this.constructs = new Constructs(this.ts, this.reference, submodule);
    this.structs = new Structs(this.ts, this.reference, submodule);
  }

  public get pythonMarkdown(): Markdown {
    this.reference.sections(
      this.constructs.pythonMarkdown,
      this.structs.pythonMarkdown
    );
    return this.reference;
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
}

export class Constructs {
  private readonly constructs: reflect.ClassType[];
  constructor(
    ts: reflect.TypeSystem,
    private readonly parentMarkdown: Markdown,
    submodule?: string
  ) {
    this.constructs = ts.classes
      .filter((c) => this.isConstruct(c))
      .filter((c) => (submodule ? inSubmodule(c, submodule) : true));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Constructs", this.parentMarkdown.headerSize + 1);

    if (this.constructs.length === 0) {
      md.lines("This library does not provide any constructs");
    }

    for (const construct of this.constructs) {
      const klass = new Class(construct, md);
      md.lines(klass.pythonMarkdown);
    }

    return md;
  }

  public isConstruct(klass: reflect.ClassType): boolean {
    if (klass.fqn === "constructs.Construct") return true;

    if (!klass.base) {
      return false;
    }

    return this.isConstruct(klass.base);
  }
}

export class Structs {
  private readonly structs: reflect.InterfaceType[];
  constructor(
    ts: reflect.TypeSystem,
    private readonly parentMarkdown: Markdown,
    submodule?: string
  ) {
    this.structs = ts.interfaces
      .filter((i) => i.datatype)
      .filter((i) => (submodule ? inSubmodule(i, submodule) : true));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Structs", this.parentMarkdown.headerSize + 1);

    if (this.structs.length === 0) {
      md.lines("This library does not provide any structs");
    }

    for (const struct of this.structs) {
      md.sections(new Struct(struct, md).pythonMarkdown);
    }

    return md;
  }
}

export class Class {
  constructor(
    private readonly klass: reflect.ClassType,
    private readonly parentMarkdown: Markdown
  ) {}
  public get pythonMarkdown(): string {
    const md = new Markdown(
      this.klass.name,
      this.parentMarkdown.headerSize + 1,
      this.klass.fqn
    );

    if (this.klass.docs.summary) {
      md.lines(this.klass.docs.summary);
    }

    if (this.klass.docs.remarks) {
      md.lines(this.klass.docs.remarks);
    }

    if (this.klass.docs.link) {
      md.lines(`See ${this.klass.docs.link}`);
    }

    if (this.klass.initializer) {
      md.sections(
        new PythonClassInitializer(this.klass.initializer, md).pythonMarkdown
      );
    }
    return md.toString();
  }
}

export class Struct {
  constructor(
    private readonly iface: reflect.InterfaceType,
    private readonly parentMarkdown: Markdown
  ) {}
  public get pythonMarkdown(): Markdown {
    const md = new Markdown(
      this.iface.name,
      this.parentMarkdown.headerSize + 1,
      this.iface.fqn
    );

    if (this.iface.docs.summary) {
      md.lines(this.iface.docs.summary);
    }

    if (this.iface.docs.remarks) {
      md.lines(this.iface.docs.remarks);
    }

    if (this.iface.docs.link) {
      md.lines(`See ${this.iface.docs.link}`);
    }

    return md;
  }
}

export class PythonClassInitializer {
  constructor(
    private readonly initializer: reflect.Initializer,
    private readonly parentMarkdown: Markdown
  ) {}

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Initializer", this.parentMarkdown.headerSize + 1);

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

    md.lines(
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
      for (const parameter of structParameters) {
        if (!parameter.type.fqn) {
          throw new Error("asdasd");
        }

        const struct = this.initializer.system.findInterface(
          parameter.type.fqn
        );
        for (const property of struct.allProperties) {
          md.sections(new PythonArgument(property, md).pythonMarkdown);
          md.lines("---");
        }
      }
    }

    return md;
  }

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
    private readonly argument: reflect.Parameter | reflect.Property,
    private readonly parentMarkdown: Markdown
  ) {}

  public get pythonMarkdown(): Markdown {
    const md = new Markdown(
      this.argument.name,
      this.parentMarkdown.headerSize + 1
    );

    md.lines(
      `- *Type: ${this.link(this.argument.type)} | **${
        this.argument.optional ? "Optional" : "Required"
      }** | Default: ${this.argument.spec.docs?.default}*`
    );

    if (this.argument.docs.deprecated) {
      md.lines(`- *Deprecated: ${this.argument.docs.deprecationReason}`);
    }

    if (this.argument.docs.summary) {
      md.lines(this.argument.docs.summary);
    }
    if (this.argument.docs.remarks) {
      md.lines(this.argument.docs.remarks);
    }

    return md;
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
    "aws-cdk-lib.aws_secretsmanager"
  );

  fs.writeFileSync(
    `${__dirname}/readme.md`,
    reference.pythonMarkdown.toString()
  );
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
