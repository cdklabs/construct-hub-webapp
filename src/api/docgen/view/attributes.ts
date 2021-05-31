import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Attribute } from "./attribute";

export class Attributes {
  private readonly attributes: Attribute[];
  constructor(transpile: Transpile, properties: reflect.Property[]) {
    this.attributes = properties
      .filter((p) => !p.protected && !p.const)
      .map((p) => new Attribute(transpile, p));
  }

  public render(): Markdown {
    if (this.attributes.length === 0) {
      return Markdown.EMPTY;
    }

    const md = new Markdown({ header: { title: "Attributes" } });
    for (const a of this.attributes) {
      md.section(a.render());
    }
    return md;
  }
}
