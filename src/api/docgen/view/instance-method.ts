import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile, TranspiledCallable } from "../transpile/transpile";
import { Parameter } from "./parameter";

export class InstanceMethod {
  private readonly transpiled: TranspiledCallable;
  private readonly parameters: Parameter[];
  constructor(
    private readonly transpile: Transpile,
    private readonly method: reflect.Method
  ) {
    this.transpiled = transpile.callable(method);
    this.parameters = this.transpiled.parameters.map(
      (p) => new Parameter(this.transpile, p)
    );
  }

  public get markdown(): Markdown {
    const md = new Markdown({
      id: `${this.transpiled.parentType.fqn}.${this.transpiled.name}`,
      header: {
        title: this.transpiled.name,
        code: true,
        deprecated: this.method.docs.deprecated,
      },
    });

    md.code(this.transpile.language, this.transpiled.signature);

    for (const parameter of this.parameters) {
      md.section(parameter.markdown);
    }

    return md;
  }
}
