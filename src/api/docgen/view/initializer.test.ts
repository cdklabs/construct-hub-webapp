import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { Initializer } from "./initializer";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile(assembly.system);
  test("snapshot", () => {
    const initializer = new Initializer(transpile, findInitializer());
    expect(initializer.markdown.render()).toMatchSnapshot();
  });
});

function findInitializer(): reflect.Initializer {
  for (const klass of assembly.system.classes) {
    if (klass.initializer) {
      return klass.initializer;
    }
  }
  throw new Error("Assembly does not contain an initializer");
}
