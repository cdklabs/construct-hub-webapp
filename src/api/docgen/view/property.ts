import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";

export class Property {
  constructor(
    private readonly transpile: Transpile,
    private readonly property: reflect.Property
  ) {}

  public get markdown(): Markdown {
    const transpiled = this.transpile.property(this.property);

    const optionality = this.property.const
      ? undefined
      : this.property.optional
      ? "Optional"
      : "Required";

    const md = new Markdown({
      header: {
        title: transpiled.name,
        sup: optionality,
        code: true,
        deprecated: this.property.docs.deprecated,
      },
    });

    if (this.property.docs.deprecated) {
      md.bullet(
        `${Markdown.emphasis("Deprecated:")} ${
          this.property.docs.deprecationReason
        }`
      );
      md.lines("");
    }

    const metadata: any = {
      Type: transpiled.typeReference.markdown,
    };

    if (this.property.spec.docs?.default) {
      metadata.Default = Markdown.sanitize(this.property.spec.docs?.default);
    }

    for (const [key, value] of Object.entries(metadata)) {
      md.bullet(`${Markdown.emphasis(`${key}:`)} ${value}`);
    }
    md.lines("");

    if (this.property.docs) {
      md.docs(this.property.docs);
    }

    md.split();

    return md;
  }
}
