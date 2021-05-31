import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { Enum } from "./enum";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile(assembly.system);
  test("snapshot", () => {
    const enu = new Enum(transpile, assembly.enums[0]);
    expect(enu.render().render()).toMatchSnapshot();
  });
});
