import * as reflect from "jsii-reflect";
import { Documentation } from "./documentation";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  test("snapshot", () => {
    const docs = new Documentation({
      language: "python",
      assembly: assembly,
      readme: true,
    });
    expect(docs.render().render()).toMatchSnapshot();
  });
});

describe("typescript", () => {
  test("snapshot", () => {
    const docs = new Documentation({
      language: "typescript",
      assembly: assembly,
      readme: true,
    });
    expect(docs.render().render()).toMatchSnapshot();
  });
});
