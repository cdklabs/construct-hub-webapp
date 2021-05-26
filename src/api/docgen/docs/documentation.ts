import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { PythonTranspile } from "../transpile/python";
import { Transpile } from "../transpile/transpile";
import { ApiReference } from "./api-reference";
import { Readme } from "./readme";

/**
 * Languages supported by jsii.
 */
export enum Language {
  /**
   * Python
   */
  PYTHON = "python",

  /**
   * Typescript
   */
  TYPESCRIPT = "typescript",
}

/**
 * Options for rendering documentation pages.
 */
export interface DocumentationOptions {
  /**
   * Which language to generate docs for.
   */
  readonly language: Language;

  /**
   * Include a generated api reference in the documentation.
   *
   * @default true
   */
  readonly apiReference?: boolean;

  /**
   * Include the user defined README.md in the documentation.
   *
   * @default true
   */
  readonly readme?: boolean;

  /**
   * Generate documentation only for a specific submodule.
   *
   * @default - Documentation is generated for all submodules.
   */
  readonly submoduleName?: string;
}

/**
 * Render documentation pages for a jsii library.
 */
export class Documentation {
  private readonly ts: reflect.TypeSystem;
  private readonly assembly: reflect.Assembly;
  private readonly submodule?: reflect.Submodule;

  private readonly includeReadme: boolean;
  private readonly includeApiReference: boolean;

  private readonly transpile: Transpile;

  constructor(
    packageName: string,
    assemblies: spec.Assembly[],
    options: DocumentationOptions
  ) {
    this.ts = new reflect.TypeSystem();

    switch (options.language) {
      case Language.PYTHON:
        this.transpile = new PythonTranspile(this.ts);
        break;
      default:
        throw new Error(
          `Generating documentation for ${options.language} is not supported`
        );
    }

    for (const assembly of assemblies) {
      this.ts.addAssembly(new reflect.Assembly(this.ts, assembly));
    }

    this.assembly = this.ts.findAssembly(packageName);

    if (options.submoduleName) {
      this.submodule = this.findSubmodule(options.submoduleName);
    }

    this.includeApiReference = options.apiReference ?? true;
    this.includeReadme = options.readme ?? false;
  }

  /**
   * Generate the documentation for python in markdown format.
   */
  public get markdown(): Markdown {
    const documentation = new Markdown();

    if (this.includeReadme) {
      const readme = new Readme(this.transpile, this.assembly, this.submodule);
      documentation.section(readme.markdown);
    }
    if (this.includeApiReference) {
      const apiReference = new ApiReference(
        this.transpile,
        this.ts,
        this.submodule
      );
      documentation.section(apiReference.markdown);
    }

    return documentation;
  }

  private findSubmodule(submoduleName: string): reflect.Submodule {
    const submodules = this.assembly.submodules.filter(
      (s) => s.name === submoduleName
    );

    if (submodules.length === 0) {
      throw new Error(`Submodule ${submoduleName} not found`);
    }

    if (submodules.length > 1) {
      throw new Error(`Found multiple submodules with name: ${submoduleName}`);
    }

    return submodules[0];
  }
}
