import * as reflect from "jsii-reflect";
import { propertyToParameter, renderDocs } from "../helpers";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Initializer } from "./initializer";
import { View } from "./view";

export class Struct implements View {
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
      renderDocs(this.iface.docs, md);
    }

    const parameters: reflect.Parameter[] = [];
    const initializer: reflect.Initializer = {
      abstract: false,
      parameters,
      docs: this.iface.docs,
      parentType: this.iface,
      system: this.iface.system,
      variadic: false,
      assembly: this.iface.assembly,
      spec: this.iface.spec,
      kind: reflect.MemberKind.Initializer,
      name: "<initializer>",
      overrides: undefined,
      protected: false,
      locationInModule: this.iface.locationInModule,
      locationInRepository: this.iface.locationInRepository,
    };

    initializer.parameters.push(
      ...this.iface.allProperties.map((p) =>
        propertyToParameter(initializer, p)
      )
    );

    md.section(new Initializer(this.transpile, initializer).markdown);
    return md;
  }
}
