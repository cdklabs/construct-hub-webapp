import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { Property } from "./property";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile(assembly.system);
  test("snapshot", () => {
    const parameter = new Property(
      transpile,
      assembly.system.interfaces[0].allProperties[0]
    );
    expect(parameter.markdown.render()).toMatchSnapshot();
  });
});
