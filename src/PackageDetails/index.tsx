import * as spec from "@jsii/spec";
import MarkdownPreview from "@uiw/react-markdown-preview";
import React from "react";
import { Documentation, Language } from "../api/docgen/docs/documentation";

interface PackageDetailsProps {
  name: string;
  scope?: string;
  version: string;
  submodule?: string;
}

export default class PackageDetails extends React.Component<
  PackageDetailsProps,
  { assemblies: spec.Assembly[]; packageFqn: string }
> {
  constructor(props: PackageDetailsProps) {
    super(props);
    this.state = {
      assemblies: [],
      packageFqn: `${this.props.scope ? `${this.props.scope}/` : ""}${
        this.props.name
      }`,
    };
  }

  public componentDidMount() {
    fetchAssemblies(this.state.packageFqn, this.props.version)
      .then((assemblies) => this.setState({ assemblies }))
      .catch((e) => {
        throw e;
      });
  }

  public render() {
    const assemblies = this.state.assemblies;

    let rendered = "Loading...this may take a few seconds";

    if (assemblies.length > 0) {
      const doc = new Documentation(this.state.packageFqn, assemblies, {
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
}

async function fetchAssemblies(
  name: string,
  version: string
): Promise<spec.Assembly[]> {
  const assemblies: spec.Assembly[] = [];

  async function recurse(_name: string, _version: string) {
    const assembly = await fetchAssembly(_name, _version);
    assemblies.push(assembly);
    for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
      await recurse(d, v);
    }
  }

  await recurse(name, version);

  return assemblies;
}

async function fetchAssembly(
  name: string,
  version: string
): Promise<spec.Assembly> {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }
  // e.g https://awscdk.io/packages/@aws-cdk/alexa-ask@1.106.0/jsii.json
  const response = await fetch(`/packages/${name}@${version}/jsii.json`);
  return response.json();
}
