import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Classes } from "./classes";
import { Constructs } from "./constructs";
import { Enums } from "./enums";
import { Interfaces } from "./interfaces";
import { Structs } from "./structs";

/**
 * Render an API reference based on the jsii assembly.
 */
export class ApiReference {
  private readonly constructs: Constructs;
  private readonly structs: Structs;
  private readonly interfaces: Interfaces;
  private readonly classes: Classes;
  private readonly enums: Enums;
  constructor(
    transpile: Transpile,
    assembly: reflect.Assembly,
    submodule?: reflect.Submodule
  ) {
    const classes = this.filterSubmodule(assembly.classes, submodule);
    const interfaces = this.filterSubmodule(assembly.interfaces, submodule);
    const enums = this.filterSubmodule(assembly.enums, submodule);

    this.constructs = new Constructs(transpile, classes);
    this.classes = new Classes(transpile, classes);
    this.structs = new Structs(transpile, interfaces);
    this.interfaces = new Interfaces(transpile, interfaces);
    this.enums = new Enums(transpile, enums);
  }

  /**
   * Generate markdown.
   */
  public render(): Markdown {
    const md = new Markdown({ header: { title: "API Reference" } });
    md.section(this.constructs.render());
    md.section(this.structs.render());
    md.section(this.classes.render());
    md.section(this.interfaces.render());
    md.section(this.enums.render());
    return md;
  }

  private filterSubmodule<Type extends reflect.Type>(
    arr: readonly Type[],
    submodule?: reflect.Submodule
  ): Type[] {
    return arr
      .filter((e) =>
        submodule ? !!e.namespace?.startsWith(submodule.name) : true
      )
      .sort((s1, s2) => s1.name.localeCompare(s2.name));
  }
}
