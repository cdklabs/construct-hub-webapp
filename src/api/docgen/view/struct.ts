import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Property } from "./property";

export class Struct {
  constructor(
    private readonly transpile: Transpile,
    private readonly iface: reflect.InterfaceType
  ) {}

  public get markdown(): Markdown {
    const md = new Markdown({
      id: this.iface.fqn,
      header: { title: this.iface.name },
    });

    if (this.iface.docs) {
      md.docs(this.iface.docs);
    }

    md.section(this.renderInitializer());
    return md;
  }

  private renderInitializer(): Markdown {
    const md = new Markdown({
      id: `${this.iface.fqn}.Initializer`,
      header: {
        title: "Initializer",
      },
    });

    const transpiled = this.transpile.struct(this.iface);

    md.snippet(
      this.transpile.language,
      `${transpiled.requirement}`,
      "",
      `${transpiled.invocation}`
    );

    for (const property of this.iface.allProperties) {
      md.section(new Property(this.transpile, property).markdown);
    }

    return md;
  }
}
