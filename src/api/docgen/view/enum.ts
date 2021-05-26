import * as reflect from "jsii-reflect";
import { renderDocs } from "../helpers";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { View } from "./view";

export class Enum implements View {
  constructor(
    private readonly transpile: Transpile,
    private readonly enu: reflect.EnumType
  ) {}

  public get markdown(): Markdown {
    const transpiled = this.transpile.enum(this.enu);
    const md = new Markdown({ header: { title: transpiled.name } });

    if (this.enu.docs) {
      renderDocs(this.enu.docs, md);
    }

    for (const m of this.enu.members) {
      const member = new Markdown({
        header: {
          title: m.name,
          code: true,
          deprecated: m.docs.deprecated,
        },
      });

      if (m.docs.deprecated) {
        md.bullet(
          `${Markdown.emphasis("Deprecated:")} ${m.docs.deprecationReason}`
        );
        md.lines("");
      }

      if (m.docs) {
        renderDocs(m.docs, member);
      }

      member.split();
      member.lines("");

      md.section(member);
    }

    md.split();
    md.lines("");
    return md;
  }
}
