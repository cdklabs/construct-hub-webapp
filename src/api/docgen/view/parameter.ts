import * as reflect from "jsii-reflect";
import { renderDocs } from "../helpers";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { View } from "./view";

export class Parameter implements View {
  constructor(
    private readonly transpile: Transpile,
    private readonly parameter: reflect.Parameter
  ) {}

  public get markdown(): Markdown {
    const transpiled = this.transpile.parameter(this.parameter, false);
    const optionality = this.parameter.optional ? "Optional" : "Required";

    const md = new Markdown({
      header: {
        title: transpiled.name,
        sup: optionality,
        code: true,
        deprecated: this.parameter.docs.deprecated,
      },
    });

    if (this.parameter.docs.deprecated) {
      md.lines(`- *Deprecated:* ${this.parameter.docs.deprecationReason}`);
      md.lines("");
    }

    const metadata: any = {
      Type: transpiled.typeReference.linked,
    };

    if (this.parameter.spec.docs?.default) {
      metadata.Default = Markdown.sanitize(this.parameter.spec.docs?.default);
    }

    for (const [key, value] of Object.entries(metadata)) {
      md.lines(`- *${key}:* ${value}`);
    }
    md.lines("");

    if (this.parameter.docs) {
      renderDocs(this.parameter.docs, md);
    }

    md.lines("---");
    md.lines("");

    return md;
  }
}
