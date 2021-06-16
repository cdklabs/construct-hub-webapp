import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { Interface } from "./interface";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile();
  test("snapshot", () => {
    const klass = new Interface(transpile, findInterface());
    expect(klass.render().render()).toMatchSnapshot();
  });
});

function findInterface() {
  for (const iface of assembly.interfaces) {
    if (!iface.datatype) {
      return iface;
    }
  }
  throw new Error("Assembly does not contain an interface");
}
