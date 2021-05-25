import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Parameter } from "./parameter";
import { View } from "./view";

export class StaticFunction implements View {
  constructor(
    private readonly transpile: Transpile,
    private readonly method: reflect.Method
  ) {}

  public get markdown(): Markdown {
    const transpiled = this.transpile.callable(this.method);

    const md = new Markdown({
      header: {
        title: transpiled.name,
        code: true,
        deprecated: this.method.docs.deprecated,
      },
    });

    md.code(
      this.transpile.language,
      `${transpiled.requirement}`,
      "",
      `${transpiled.invocation}`
    );

    for (const parameter of transpiled.parameters) {
      md.section(new Parameter(this.transpile, parameter).markdown);
    }

    return md;
  }
}
