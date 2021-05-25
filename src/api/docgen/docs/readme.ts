import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";

/**
 * Render the user defined readme of a jsii library.
 */
export class Readme {
  private readonly readme?: spec.ReadMe;

  constructor(
    private readonly transpile: Transpile,
    assembly: reflect.Assembly,
    submodule?: reflect.Submodule
  ) {
    this.readme = submodule ? submodule.readme : assembly.readme;
  }

  /**
   * Generate markdown.
   */
  public get markdown(): Markdown {
    if (!this.readme) {
      return Markdown.EMPTY;
    }

    const md = new Markdown();
    md.lines(this.transpile.readme(this.readme.markdown));
    return md;
  }
}
