import { Box } from "@chakra-ui/react";
import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { GettingStarted } from "../GettingStarted";
import { PackageDocs } from "../PackageDocs";
import { PackageHeader } from "../PackageHeader";
import { getAssetsPath, parseSearch, getFullPackageName } from "./util";

type Assemblies = { [packageName: string]: spec.Assembly };

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

interface PackageDocsHomeState {
  assembly?: reflect.Assembly;
  error?: string;
}

export function Package() {
  const { name, scope, version }: PathParams = useParams();
  const [{ assembly }, setState] = useState<PackageDocsHomeState>({});
  const q = parseSearch(useLocation().search);

  useEffect(() => {
    fetchAssemblies(name, version, scope)
      .then((assemblies: Assemblies) => {
        setState({
          assembly: createAssembly(getFullPackageName(name, scope), assemblies),
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
      {assembly && (
        <PackageHeader
          title={getFullPackageName(name, scope)}
          description={assembly?.description}
          tags={[]}
        />
      )}

      {/* Getting Started Area */}
      <GettingStarted targets={targets} />

      {/* Readme and Api Reference Area */}
      {assembly && (
        <PackageDocs
          assembly={assembly}
          language={q.language ?? "python"}
          submodule={q.submodule}
        />
      )}
    </Box>
  );
}

async function fetchAssembly(
  name: string,
  version: string,
  scope?: string
): Promise<spec.Assembly> {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }

  // e.g https://awscdk.io/packages/@aws-cdk/alexa-ask@1.106.0/jsii.json
  const assemblyPath = `${getAssetsPath(name, version, scope)}/jsii.json`;
  const response = await fetch(assemblyPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching assembly for ${assemblyPath}: ${response.statusText}`
    );
  }
  return response.json();
}

async function fetchAssemblies(
  name: string,
  version: string,
  scope?: string
): Promise<Assemblies> {
  const assemblies: Assemblies = {};

  async function recurse(_name: string, _version: string, _scope?: string) {
    const assembly = await fetchAssembly(_name, _version, _scope);
    const packageFqn = `${getFullPackageName(_name, _scope)}@${_version};`;
    if (assemblies[packageFqn]) {
      return;
    }
    assemblies[packageFqn] = assembly;
    for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
      const scopeAndName = d.split("/");
      if (scopeAndName.length > 1) {
        await recurse(scopeAndName[1], v, scopeAndName[0]);
      } else {
        await recurse(scopeAndName[0], v, "");
      }
    }
  }

  await recurse(name, version, scope);

  return assemblies;
}

function createAssembly(
  fullPackageName: string,
  assemblies: Assemblies
): reflect.Assembly {
  const ts = new reflect.TypeSystem();
  Object.values(assemblies).forEach((a) => {
    ts.addAssembly(new reflect.Assembly(ts, a));
  });
  return ts.findAssembly(fullPackageName);
}
