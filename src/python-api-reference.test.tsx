import * as fs from "fs";
import * as spec from "@jsii/spec";
import { Documentation, Language } from "./api/docgen/docs/documentation";

test("basic", () => {
  const documentation = new Documentation(
    "aws-cdk-lib",
    "2.0.0-rc4",
    fetchAssembly,
    {
      submoduleName: "aws_secretsmanager",
      readme: true,
      apiReference: true,
      language: Language.PYTHON,
    }
  );

  fs.writeFileSync(`${__dirname}/readme.md`, documentation.markdown.render());
  // expect(reference.pythonMarkdown).toMatchSnapshot();
});

function fetchAssembly(name: string, version: string): spec.Assembly {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }
  const assembly = fs
    .readFileSync(
      `${__dirname}/../test/resources/jsii-assemblies/${name}-${version}.json`,
      {
        encoding: "utf8",
      }
    )
    .toString();

  return JSON.parse(assembly) as spec.Assembly;
}
