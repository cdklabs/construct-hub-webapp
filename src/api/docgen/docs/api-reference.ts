import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Class } from "../view/class";
import { Enum } from "../view/enum";
import { Struct } from "../view/struct";

/**
 * Render an API reference based on the jsii assembly.
 */
export class ApiReference {
  constructor(
    private readonly transpile: Transpile,
    private readonly ts: reflect.TypeSystem,
    private readonly submodule?: reflect.Submodule
  ) {}

  /**
   * Generate markdown.
   */
  public get markdown(): Markdown {
    const md = new Markdown({ header: { title: "API Reference" } });
    md.section(this.renderConstructs());
    md.section(this.renderStructs());
    md.section(this.renderClasses());
    md.section(this.renderEnums());
    return md;
  }

  private renderConstructs(): Markdown {
    const constructs = this.ts.classes
      .filter((c) => this.isConstruct(c))
      .filter((c) =>
        this.submodule ? this.insideSubmodule(c, this.submodule) : true
      )
      .sort((c1, c2) => c1.name.localeCompare(c2.name));

    const md = new Markdown({ header: { title: "Constructs" } });
    if (constructs.length === 0) {
      return Markdown.EMPTY;
    }

    for (const construct of constructs) {
      md.section(new Class(this.transpile, construct).markdown);
    }

    return md;
  }

  private renderStructs(): Markdown {
    const structs = this.ts.interfaces
      .filter((i) => i.datatype)
      .filter((i) =>
        this.submodule ? this.insideSubmodule(i, this.submodule) : true
      )
      .sort((s1, s2) => s1.name.localeCompare(s2.name));

    const md = new Markdown({ header: { title: "Structs" } });
    if (structs.length === 0) {
      return Markdown.EMPTY;
    }

    for (const struct of structs) {
      md.section(new Struct(this.transpile, struct).markdown);
    }

    return md;
  }

  private renderClasses(): Markdown {
    const md = new Markdown({ header: { title: "Classes" } });

    const classes = this.ts.classes
      .filter((c) => !this.isConstruct(c))
      .filter((c) =>
        this.submodule ? this.insideSubmodule(c, this.submodule) : true
      )
      .sort((c1, c2) => c1.name.localeCompare(c2.name));

    if (classes.length === 0) {
      return Markdown.EMPTY;
    }

    for (const klass of classes) {
      md.section(new Class(this.transpile, klass).markdown);
    }

    return md;
  }

  private renderEnums(): Markdown {
    const md = new Markdown({ header: { title: "Enums" } });

    const enums = this.ts.enums
      .filter((c) =>
        this.submodule ? this.insideSubmodule(c, this.submodule) : true
      )
      .sort((c1, c2) => c1.name.localeCompare(c2.name));

    if (enums.length === 0) {
      return Markdown.EMPTY;
    }

    for (const enu of enums) {
      md.section(new Enum(this.transpile, enu).markdown);
    }

    return md;
  }

  private isConstruct(klass: reflect.ClassType): boolean {
    if (klass.fqn === "constructs.Construct") return true;

    if (!klass.base) {
      return false;
    }

    return this.isConstruct(klass.base);
  }

  private insideSubmodule(
    type: reflect.Type,
    submodule: reflect.Submodule
  ): boolean {
    return type.fqn.includes(submodule.name);
  }
}
