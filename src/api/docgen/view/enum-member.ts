import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile, TranspiledEnumMember } from "../transpile/transpile";

export class EnumMember {
  private readonly transpiled: TranspiledEnumMember;
  constructor(transpile: Transpile, private readonly em: reflect.EnumMember) {
    this.transpiled = transpile.enumMember(em);
  }
  public get markdown(): Markdown {
    const md = new Markdown({
      id: `${this.transpiled.fqn}`,
      header: {
        title: this.transpiled.name,
        code: true,
        deprecated: this.em.docs.deprecated,
      },
    });

    if (this.em.docs.deprecated) {
      md.bullet(
        `${Markdown.emphasis("Deprecated:")} ${this.em.docs.deprecationReason}`
      );
      md.lines("");
    }

    if (this.em.docs) {
      md.docs(this.em.docs);
    }

    md.split();
    md.lines("");

    return md;
  }
}
