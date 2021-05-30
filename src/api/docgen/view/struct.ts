import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile, TranspiledStruct } from "../transpile/transpile";
import { Property } from "./property";

export class Struct {
  private readonly transpiled: TranspiledStruct;
  private readonly properties: Property[] = new Array<Property>();
  constructor(
    private readonly transpile: Transpile,
    private readonly iface: reflect.InterfaceType
  ) {
    this.transpiled = transpile.struct(iface);
    for (const property of this.iface.allProperties) {
      this.properties.push(new Property(this.transpile, property));
    }
  }

  public get markdown(): Markdown {
    const md = new Markdown({
      id: this.transpiled.type.fqn,
      header: { title: this.transpiled.name },
    });

    if (this.iface.docs) {
      md.docs(this.iface.docs);
    }

    const initializer = new Markdown({
      id: `${this.transpiled.type}.Initializer`,
      header: { title: "Initializer" },
    });

    initializer.code(
      this.transpile.language,
      `${this.transpiled.requirement}`,
      "",
      `${this.transpiled.invocation}`
    );

    for (const property of this.properties) {
      initializer.section(property.markdown);
    }

    md.section(initializer);
    return md;
  }
}
