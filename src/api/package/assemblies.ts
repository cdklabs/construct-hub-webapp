import * as spec from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { API_PATHS } from "../../constants/url";
import { getAssetsPath, getFullPackageName } from "./util";

type Assemblies = { [packageName: string]: spec.Assembly };

export const fetchMarkdown = async (
  name: string,
  version: string,
  scope?: string,
  language?: string,
  submodule?: string
): Promise<string> => {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }

  const docsSuffix = `/docs-${submodule ? `${submodule}-` : ""}${
    language ?? "ts"
  }.md`;

  const markdownPath = `${getAssetsPath(name, version, scope)}${docsSuffix}`;
  const response = await fetch(markdownPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching documentation for ${markdownPath}: ${response.statusText}`
    );
  }
  return response.text();
};

export const fetchAssembly = async (
  name: string,
  version: string,
  scope?: string
): Promise<spec.Assembly> => {
  if (version.startsWith("^")) {
    version = version.substring(1, version.length);
  }

  const assemblyPath = `${getAssetsPath(name, version, scope)}${
    API_PATHS.ASSEMBLY_SUFFIX
  }`;
  const response = await fetch(assemblyPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching assembly for ${assemblyPath}: ${response.statusText}`
    );
  }
  return response.json();
};

const fetchAssemblies = async (
  name: string,
  version: string,
  scope?: string
): Promise<Assemblies> => {
  const assemblies: Assemblies = {};
  const requested = new Set();

  const recurse = async (_name: string, _version: string, _scope?: string) => {
    const packageFqn = `${getFullPackageName(_name, _scope)}@${_version};`;

    if (requested.has(packageFqn)) {
      return;
    }

    requested.add(packageFqn);
    const assembly = await fetchAssembly(_name, _version, _scope);
    assemblies[packageFqn] = assembly;
    const promises: Promise<void>[] = [];

    for (const [d, v] of Object.entries(assembly.dependencies ?? {})) {
      const scopeAndName = d.split("/");
      if (scopeAndName.length > 1) {
        promises.push(recurse(scopeAndName[1], v, scopeAndName[0]));
      } else {
        promises.push(recurse(scopeAndName[0], v, ""));
      }
    }

    await Promise.all(promises);
  };

  await recurse(name, version, scope);

  return assemblies;
};

export const createAssembly = async (
  name: string,
  version: string,
  scope?: string
): Promise<reflect.Assembly> => {
  const assemblies = await fetchAssemblies(name, version, scope);
  const ts = new reflect.TypeSystem();
  Object.values(assemblies).forEach((a) => {
    ts.addAssembly(new reflect.Assembly(ts, a));
  });
  return ts.findAssembly(getFullPackageName(name, scope));
};
