import * as fs from "fs";
import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";

function inSubmodule(
  type: reflect.ReferenceType,
  submodule: reflect.Submodule
): boolean {
  return type.fqn.includes(submodule.name);
}

export interface AssemblyFetcher {
  fetchAssembly(name: string, version: string): spec.Assembly;
}

export interface MarkdownHeaderOptions {
  readonly size?: number;
  readonly title?: string;
  readonly code?: boolean;
  readonly deprecated?: boolean;
}

export interface MarkdownOptions {
  readonly header?: MarkdownHeaderOptions;
  readonly id?: string;
}

export class Markdown {
  private readonly _lines = new Array<string>();
  private readonly _sections = new Array<Markdown>();

  private readonly id?: string;
  private readonly header?: string;

  constructor(private readonly options: MarkdownOptions = {}) {
    this.id = options.id ?? options.header?.title;
    this.header = this.formatHeader();
  }

  private formatHeader(): string | undefined {
    if (!this.options.header?.title) {
      return undefined;
    }
    let caption = this.options.header.title;

    if (this.options.header?.code ?? false) {
      caption = `\`${caption}\``;
    }

    if (this.options.header?.deprecated ?? false) {
      caption = `~~${caption}~~`;
    }
    return caption;
  }

  public lines(...lines: string[]) {
    this._lines.push(...lines);
  }

  public sections(section: Markdown) {
    this._sections.push(section);
  }

  public render(headerSize: number = 0): string {
    const content = [];
    if (this.header) {
      const heading = `${"#".repeat(headerSize)} ${this.header}`;
      content.push(`${heading} <a name="${this.id}"></a>`);
      content.push("");
    }

    content.push(...this._lines);
    for (const section of this._sections) {
      content.push(section.render(headerSize + 1));
    }
    return content.join("\n");
  }
}

export interface DocumentationOptions {
  readonly apiReference?: boolean;
  readonly readme?: boolean;
  readonly fetcher?: AssemblyFetcher;
  readonly submoduleName?: string;
}

export class Documentation {
  private readonly ts: reflect.TypeSystem;
  private readonly assembly: reflect.Assembly;
  private readonly submodule?: reflect.Submodule;

  private readonly includeReadme: boolean;
  private readonly includeApiReference: boolean;

  constructor(
    assemblyName: string,
    assemblyVersion: string,
    options: DocumentationOptions = {}
  ) {
    this.ts = new reflect.TypeSystem();

    const assemblies = this.fetchAssemblies(
      assemblyName,
      assemblyVersion,
      options.fetcher!
    );

    for (const assembly of assemblies) {
      this.ts.addAssembly(new reflect.Assembly(this.ts, assembly));
    }

    this.assembly = this.ts.findAssembly(assemblyName);

    if (options.submoduleName) {
      this.submodule = this.assembly.submodules.filter(
        (s) => s.name === options.submoduleName
      )[0];
    }

    this.includeApiReference = options.apiReference ?? true;
    this.includeReadme = options.readme ?? false;
  }

  public get pythonMarkdown(): Markdown {
    const documentation = new Markdown();

    if (this.includeReadme) {
      const readme = new Readme(this.assembly, this.submodule);
      documentation.sections(readme.pythonMarkdown);
    }
    if (this.includeApiReference) {
      const apiReference = new ApiReference(this.ts, this.submodule);
      documentation.sections(apiReference.pythonMarkdown);
    }

    return documentation;
  }

  public fetchAssemblies(
    name: string,
    version: string,
    fetcher: AssemblyFetcher
  ): spec.Assembly[] {
    const assemblies: spec.Assembly[] = new Array<spec.Assembly>();

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

export class Readme {
  private readonly readme: spec.ReadMe;
  constructor(assembly: reflect.Assembly, submodule?: reflect.Submodule) {
    const readme = submodule ? submodule.readme : assembly.readme;

    if (!readme) {
      const moduleFqn = [assembly.name];
      if (submodule) {
        moduleFqn.push(submodule.name);
      }
      throw new Error(`Unable to include readme for ${moduleFqn.join(".")}`);
    }
    this.readme = readme;
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown();
    md.lines(this.readme.markdown);
    return md;
  }
}

export class ApiReference {
  private readonly constructs: Constructs;
  private readonly structs: Structs;

  constructor(ts: reflect.TypeSystem, submodule?: reflect.Submodule) {
    this.constructs = new Constructs(ts, submodule);
    this.structs = new Structs(ts, submodule);
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown({ header: { title: "API Reference" } });
    md.sections(this.constructs.pythonMarkdown);
    md.sections(this.structs.pythonMarkdown);

    return md;
  }
}

export class Constructs {
  private readonly constructs: reflect.ClassType[];
  constructor(ts: reflect.TypeSystem, submodule?: reflect.Submodule) {
    this.constructs = ts.classes
      .filter((c) => this.isConstruct(c))
      .filter((c) => (submodule ? inSubmodule(c, submodule) : true))
      .sort((c1, c2) => c1.name.localeCompare(c2.name));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown({ header: { title: "Constructs" } });
    if (this.constructs.length === 0) {
      md.lines("This library does not provide any constructs");
    }

    for (const construct of this.constructs) {
      const klass = new Class(construct);
      md.sections(klass.pythonMarkdown);
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
  constructor(ts: reflect.TypeSystem, submodule?: reflect.Submodule) {
    this.structs = ts.interfaces
      .filter((i) => i.datatype)
      .filter((i) => (submodule ? inSubmodule(i, submodule) : true))
      .sort((s1, s2) => s1.name.localeCompare(s2.name));
  }

  public get pythonMarkdown(): Markdown {
    const md = new Markdown({ header: { title: "Structs" } });
    if (this.structs.length === 0) {
      md.lines("This library does not provide any structs");
    }

    for (const struct of this.structs) {
      md.sections(new Struct(struct).pythonMarkdown);
    }

    return md;
  }
}

export class Class {
  constructor(private readonly klass: reflect.ClassType) {}
  public get pythonMarkdown(): Markdown {
    const md = new Markdown({
      id: this.klass.fqn,
      header: { title: this.klass.name },
    });
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
      md.sections(
        new PythonClassInitializer(this.klass.initializer).pythonMarkdown
      );
    }
    return md;
  }
}

export class Struct {
  constructor(private readonly iface: reflect.InterfaceType) {}
  public get pythonMarkdown(): Markdown {
    const md = new Markdown({
      id: this.iface.fqn,
      header: { title: this.iface.name },
    });
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
    const md = new Markdown({ header: { title: "Initializer" } });
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
          md.sections(new PythonArgument(property).pythonMarkdown);
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
    const md = new Markdown({
      header: {
        title: this.argument.name,
        code: true,
        deprecated: this.argument.docs.deprecated,
      },
    });

    if (this.argument.docs.deprecated) {
      md.lines(`- *Deprecated: ${this.argument.docs.deprecationReason}`);
      md.lines("");
    }

    md.lines(
      `- *Type: ${this.type(this.argument.type)} | **${
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

  private type(type: reflect.TypeReference): string {
    if (spec.isNamedTypeReference(type.spec)) {
      return `[${type.toString()}](#${type.fqn})`;
    }

    if (type.unionOfTypes) {
      const types = type.unionOfTypes;
      return `${this.typing("Union")}[${types
        .map((t) => this.type(t))
        .join(", ")}]`;
    }

    if (type.arrayOfType) {
      return `${this.typing("List")}[${this.type(type.arrayOfType)}]`;
    }

    if (type.mapOfType) {
      return `${this.typing("Mapping")}[${this.type(type.mapOfType)}]`;
    }

    if (type.isAny) {
      return this.typing("Any");
    }

    if (type.primitive) {
      switch (type.primitive) {
        case "string":
          return this.builtins("str");
        case "boolean":
          return this.builtins("bool");
        case "number":
          return `${this.typing("Union")}[int, float]`;
        default:
          // TODO - add the relevant argument fqn here.
          throw new Error(`Unsupported primitive type '${type.primitive}'`);
      }
    }

    return type.toString();
  }

  private typing(type: "List" | "Mapping" | "Any" | "Union"): string {
    return `[typing.${type}](https://docs.python.org/3/library/typing.html#typing.${type})`;
  }

  private builtins(type: "bool" | "str") {
    // TODO - find a nice link
    return `builtins.${type}`;
  }
}

test("basic", () => {
  const fetcher = new AssemblyFetcherForTests();
  const documentation = new Documentation("aws-cdk-lib", "2.0.0-rc4", {
    fetcher,
    submoduleName: "aws_secretsmanager",
    readme: true,
    apiReference: true,
  });

  fs.writeFileSync(
    `${__dirname}/readme.md`,
    documentation.pythonMarkdown.render()
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
