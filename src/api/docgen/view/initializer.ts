import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Parameter } from "./parameter";
import { View } from "./view";

export class Initializer implements View {
  constructor(
    private readonly transpile: Transpile,
    private readonly initializer: reflect.Initializer
  ) {}

  public get markdown(): Markdown {
    const md = new Markdown({
      id: `${this.initializer.parentType.fqn}.Initializer`,
      header: {
        title: "Initializer",
      },
    });

    const transpiled = this.transpile.callable(this.initializer);

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
