// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

import * as fs from "fs";
import * as path from "path";
import * as jsii from "@jsii/spec";
import * as reflect from "jsii-reflect";

// randomly selected...
const ASSEMBLY_UNDER_TEST = "@aws-cdk/aws-ecr";

function createAssembly(): reflect.Assembly {
  const ts = new reflect.TypeSystem();

  const packages = `${__dirname}/../public/packages`;

  if (!fs.existsSync(packages)) {
    throw new Error(
      `Development assemblies dont exist. Please run 'yarn dev:fetch-assemblies' before executing tests`
    );
  }

  collectAssebmlies(`${__dirname}/../public/packages`, ts);

  return ts.findAssembly(ASSEMBLY_UNDER_TEST);
}

// expose the type system under test gloablly
(global as any).assembly = createAssembly();

function collectAssebmlies(p: string, ts: reflect.TypeSystem) {
  const stat = fs.statSync(p);

  if (stat.isDirectory()) {
    fs.readdirSync(p).map((f) => collectAssebmlies(path.join(p, f), ts));
  } else {
    if (!p.endsWith("jsii.json")) {
      throw new Error(
        `Unexpected file in packages: '${p}' (should contain only jsii.json files)`
      );
    }
    const assembly = JSON.parse(
      fs.readFileSync(p, { encoding: "utf8" })
    ) as jsii.Assembly;
    ts.addAssembly(new reflect.Assembly(ts, assembly));
  }
}
