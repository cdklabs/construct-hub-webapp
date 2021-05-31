import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { Struct } from "./struct";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile(assembly.system);
  test("snapshot", () => {
    const struct = new Struct(
      transpile,
      assembly.system.interfaces.filter((i) => i.datatype)[0]
    );
    expect(struct.render().render()).toMatchSnapshot();
  });
});
