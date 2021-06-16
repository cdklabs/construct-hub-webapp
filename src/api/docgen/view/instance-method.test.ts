import * as reflect from "jsii-reflect";
import { PythonTranspile } from "../transpile/python";
import { InstanceMethod } from "./instance-method";

const assembly: reflect.Assembly = (global as any).assembly;

describe("python", () => {
  const transpile = new PythonTranspile();
  test("snapshot", () => {
    const instanceMethod = new InstanceMethod(transpile, findInstanceMethod());
    expect(instanceMethod.render().render()).toMatchSnapshot();
  });
});

function findInstanceMethod(): reflect.Method {
  for (const klass of assembly.system.classes) {
    for (const method of klass.ownMethods) {
      if (!method.static) {
        return method;
      }
    }
  }
  throw new Error("Assembly does not contain an instance method");
}
