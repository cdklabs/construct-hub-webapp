import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Class } from "./class";

export class Construct {
  private readonly construct: Class;
  constructor(transpile: Transpile, klass: reflect.ClassType) {
    this.construct = new Class(transpile, klass);
  }
  public get markdown(): Markdown {
    return this.construct.markdown;
  }
}
