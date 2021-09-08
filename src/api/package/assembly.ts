import * as spec from "@jsii/spec";
import { API_PATHS } from "../../constants/url";
import { getAssetsPath } from "./util";

/**
 * Fetch assembly of a specific package from the backend.
 */
export const fetchAssembly = async (
  name: string,
  version: string,
  scope?: string
): Promise<spec.Assembly> => {
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
