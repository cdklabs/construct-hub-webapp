import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GettingStarted } from "../GettingStarted";
import { PackageDocs } from "../PackageDocs";
import { PackageHeader } from "../PackageHeader";
import { getAssetsPath } from "./util";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

interface PackageDocsHomeState {
  assembly?: any;
  readme?: string;
  error?: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();
  const [{ assembly, readme }, setState] = useState<PackageDocsHomeState>({});

  const assetPath = getAssetsPath(name, version, scope);
  useEffect(() => {
    Promise.all([
      fetch(`${assetPath}/jsii.json`).then((res) => res.json()),
      fetch(`${assetPath}/${name}-readme.md`).then((res) => res.text()),
    ])
      .then(([assemblyResponse, readmeResponse]) => {
        setState({
          assembly: assemblyResponse,
          readme: readmeResponse,
        });
      })
      .catch((err) => {
        console.error(err);
        setState((s) => ({ ...s, error: err }));
      });
  }, []);

  const targets: string[] = Object.keys(assembly?.targets ?? {});
  return (
    <Box w="100%">
      {/* Operator Area */}
      <PackageHeader
        title={scope ? `${scope}/${name}` : name}
        description={assembly?.description}
        tags={[]}
      />

      {/* Getting Started Area */}
      <GettingStarted targets={targets} />

      {/* Readme and Api Reference Area */}
      {readme && <PackageDocs readme={readme} />}
    </Box>
  );
}
