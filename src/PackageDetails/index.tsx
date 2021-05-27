import * as spec from "@jsii/spec";
import MarkdownPreview from "@uiw/react-markdown-preview";
import * as reflect from "jsii-reflect";
import React from "react";
import { Documentation, Language } from "../api/docgen/docs/documentation";

export type Assemblies = { [packageName: string]: spec.Assembly };

interface PackageDetailsProps {
  name: string;
  scope?: string;
  version: string;
  submodule?: string;
}

export default class PackageDetails extends React.Component<
  PackageDetailsProps,
  { assembly?: reflect.Assembly }
> {
  constructor(props: PackageDetailsProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    const packageName = `${this.props.scope ? `${this.props.scope}/` : ""}${
      this.props.name
    }`;
    this.fetchAssemblies(packageName, this.props.version)
      .then((assemblies) => {
        const ts = new reflect.TypeSystem();
        Object.values(assemblies).forEach((a) => {
          ts.addAssembly(new reflect.Assembly(ts, a));
        });
        this.setState({ assembly: ts.findAssembly(packageName) });
      })
      .catch((e) => {
        throw e;
      });
  }

  public render() {
    const assembly = this.state.assembly;

    let rendered = "Loading...this may take a few seconds";

    if (assembly) {
      const doc = new Documentation({
        assembly: assembly,
        language: Language.PYTHON,
        submoduleName: this.props.submodule,
        readme: true,
      });
      rendered = doc.markdown.render();
    }

    return (
      <div>
        <MarkdownPreview source={rendered} />
      </div>
    );
  }

  private async fetchAssemblies(
    name: string,
    version: string
  ): Promise<Assemblies> {
    const assemblies: Assemblies = {};

    async function recurse(_name: string, _version: string) {
      const assembly = await fetchAssembly(_name, _version);
      const packageFqn = `${_name}@${_version};`;
      if (assemblies[packageFqn]) {
        console.log(`Assembly for ${packageFqn} already fecthed`);
        return;
      }

      assemblies[packageFqn] = assembly;
      for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
        await recurse(d, v);
      }
    }

    await recurse(name, version);

    return assemblies;
  }
}

async function fetchAssembly(
  name: string,
  version: string
): Promise<spec.Assembly> {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }

  // e.g https://awscdk.io/packages/@aws-cdk/alexa-ask@1.106.0/jsii.json
  const assemblyPath = `/packages/${name}@${version}/jsii.json`;
  console.log(`Fetching assembly from ${assemblyPath}`);
  const response = await fetch(assemblyPath);
  return response.json();
}
