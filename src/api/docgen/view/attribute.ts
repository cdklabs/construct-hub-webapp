import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Property } from "./property";

export class Attribute {
  private readonly attribute: Property;
  constructor(transpile: Transpile, property: reflect.Property) {
    this.attribute = new Property(transpile, property);
  }
  public get markdown(): Markdown {
    return this.attribute.markdown;
  }
}
