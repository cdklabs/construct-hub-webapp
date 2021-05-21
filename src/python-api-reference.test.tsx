import * as fs from "fs";
import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";

function inSubmodule(type: reflect.ReferenceType, submodule: string): boolean {
  return type.fqn.startsWith(submodule);
}

export interface AssemblyFetcher {
  fetchAssembly(name: string, version: string): spec.Assembly;
}

export interface MarkdownCaptionOptions {
  readonly code?: boolean;
  readonly deprecated?: boolean;
}

export interface MarkdownOptions {
  readonly caption?: MarkdownCaptionOptions;
  readonly id?: string;
}

export class Markdown {
  private readonly _lines = new Array<string>();
  private readonly _sections = new Array<Markdown>();

  private headerSize: number;
  private id: string;
  private caption: string;

  constructor(title: string, options: MarkdownOptions = {}) {
    this.headerSize = 1;
    this.id = options.id ?? title;
    this.caption = this.formatCaption(
      title,
      options.caption?.code ?? false,
      options.caption?.deprecated ?? false
    );
  }

  private formatCaption(
    title: string,
    code: boolean,
    deprecated: boolean
  ): string {
    let caption = title;

    if (code ?? false) {
      caption = `\`${title}\``;
    }

    if (deprecated ?? false) {
      caption = `~~${title}~~`;
    }
    return caption;
  }

  public setHeaderSize(size: number) {
    if (size > 6) {
      throw new Error(
        `Unable to set header size for '${this.id}': Header limit reached`
      );
    }
    this.headerSize = size;
  }

  public lines(...lines: string[]) {
    this._lines.push(...lines);
  }

  public section(section: Markdown) {
    this._sections.push(section);
  }

  public toString(): string {
    const header = `${"#".repeat(this.headerSize)} ${this.caption} <a name="${
      this.id
    }"></a>`;

    const body = [...this._lines];
    for (const section of this._sections) {
      section.setHeaderSize(this.headerSize + 1);
      body.push(section.toString());
    }
    return [header, "", ...body].join("\n");
  }
}

export class ApiReference {
  private readonly ts: reflect.TypeSystem;
  private readonly constructs: Constructs;
  private readonly structs: Structs;
  private readonly assemblyFetcher: AssemblyFetcher;

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

    this.constructs = new Constructs(this.ts, submodule);
    this.structs = new Structs(this.ts, submodule);
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("API Reference");
    md.section(this.constructs.pythonMarkdown);
    md.section(this.structs.pythonMarkdown);
    return md;
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
  constructor(ts: reflect.TypeSystem, submodule?: string) {
    this.constructs = ts.classes
      .filter((c) => this.isConstruct(c))
      .filter((c) => (submodule ? inSubmodule(c, submodule) : true))
      .sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Constructs");
    if (this.constructs.length === 0) {
      md.lines("This library does not provide any constructs");
    }

    for (const construct of this.constructs) {
      const klass = new Class(construct);
      md.section(klass.pythonMarkdown);
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
  constructor(ts: reflect.TypeSystem, submodule?: string) {
    this.structs = ts.interfaces
      .filter((i) => i.datatype)
      .filter((i) => (submodule ? inSubmodule(i, submodule) : true))
      .sort((s1, s2) => s1.name.localeCompare(s2.name));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Structs");
    if (this.structs.length === 0) {
      md.lines("This library does not provide any structs");
    }

    for (const struct of this.structs) {
      md.section(new Struct(struct).pythonMarkdown);
    }

    return md;
  }
}

export class Class {
  constructor(private readonly klass: reflect.ClassType) {}
  public get pythonMarkdown(): Markdown {
    const md = new Markdown(this.klass.name, { id: this.klass.fqn });
    if (this.klass.docs.summary) {
      md.lines(this.klass.docs.summary);
      md.lines("");
    }

    if (this.klass.docs.remarks) {
      md.lines(this.klass.docs.remarks);
      md.lines("");
    }

    if (this.klass.docs.link) {
      md.lines(`Link: [${this.klass.docs.link}](${this.klass.docs.link})`);
      md.lines("");
    }

    if (this.klass.spec.docs?.see) {
      md.lines(`See ${this.klass.spec.docs.see}`);
      md.lines("");
    }

    const customLink = this.klass.docs.customTag("link");
    if (customLink) {
      md.lines(`> [${customLink}](${customLink})`);
      md.lines("");
    }

    if (this.klass.initializer) {
      md.section(
        new PythonClassInitializer(this.klass.initializer).pythonMarkdown
      );
    }
    return md;
  }
}

export class Struct {
  constructor(private readonly iface: reflect.InterfaceType) {}
  public get pythonMarkdown(): Markdown {
    const md = new Markdown(this.iface.name, { id: this.iface.fqn });
    if (this.iface.docs.summary) {
      md.lines(this.iface.docs.summary);
      md.lines("");
    }

    if (this.iface.docs.remarks) {
      md.lines(this.iface.docs.remarks);
      md.lines("");
    }

    if (this.iface.docs.link) {
      md.lines(`Link [${this.iface.docs.link}](${this.iface.docs.link})`);
      md.lines("");
    }

    if (this.iface.spec.docs?.see) {
      md.lines(`See ${this.iface.spec.docs.see}`);
      md.lines("");
    }

    const customLink = this.iface.docs.customTag("link");
    if (customLink) {
      md.lines(`> [${customLink}](${customLink})`);
      md.lines("");
    }

    return md;
  }
}

export class PythonClassInitializer {
  constructor(private readonly initializer: reflect.Initializer) {}

  public get pythonMarkdown(): Markdown {
    const md = new Markdown("Initializer");
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
      "```python",
      `import ${module}`,
      "",
      `${module}.${this.initializer.parentType.name}(${positional}${kwargs})`,
      "```",
      ""
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
          md.section(new PythonArgument(property).pythonMarkdown);
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
    private readonly argument: reflect.Parameter | reflect.Property
  ) {}

  public get pythonMarkdown(): Markdown {
    const md = new Markdown(this.argument.name, {
      caption: {
        code: true,
        deprecated: this.argument.docs.deprecated,
      },
    });

    if (this.argument.docs.deprecated) {
      md.lines(`- *Deprecated: ${this.argument.docs.deprecationReason}`);
      md.lines("");
    }

    md.lines(
      `- *Type: ${this.link(this.argument.type)} | **${
        this.argument.optional ? "Optional" : "Required"
      }** | Default: ${this.argument.spec.docs?.default}*`
    );

    md.lines("");

    if (this.argument.docs.summary) {
      md.lines(this.argument.docs.summary);
      md.lines("");
    }
    if (this.argument.docs.remarks) {
      md.lines(this.argument.docs.remarks);
      md.lines("");
    }

    md.lines("---");
    md.lines("");

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
