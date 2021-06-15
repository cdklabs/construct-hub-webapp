// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import * as fs from "fs";
import * as path from "path";
import * as jsii from "@jsii/spec";
import * as reflect from "jsii-reflect";

function createAssembly(name: string): reflect.Assembly {
  const ts = new reflect.TypeSystem();

  const packages = `${__dirname}/__fixtures__/assemblies`;

  collectAssebmlies(packages, ts);

  return ts.findAssembly(name);
}

// expose the assemblies under test gloablly
(global as any).assembly = createAssembly("@aws-cdk/aws-ecr");
(global as any).assemblyWithSubmodules = createAssembly("aws-cdk-lib");

function collectAssebmlies(p: string, ts: reflect.TypeSystem) {
  const stat = fs.statSync(p);

  if (stat.isDirectory()) {
    fs.readdirSync(p).map((f) => collectAssebmlies(path.join(p, f), ts));
  } else {
    if (p.endsWith("jsii.json")) {
      const assembly = JSON.parse(
        fs.readFileSync(p, { encoding: "utf8" })
      ) as jsii.Assembly;
      ts.addAssembly(new reflect.Assembly(ts, assembly));
    }
  }
}
