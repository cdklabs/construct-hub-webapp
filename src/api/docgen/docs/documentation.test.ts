import * as reflect from "jsii-reflect";
import { Documentation, Language } from "./documentation";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  test("snapshot", () => {
    const docs = new Documentation({
      language: Language.PYTHON,
      assembly: assembly,
      readme: true,
    });
    expect(docs.markdown.render()).toMatchSnapshot();
  });
});
