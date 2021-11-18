import * as spec from "@jsii/spec";
import { API_PATHS } from "../../constants/url";
import { getAssetsPath } from "./util";

// These fields are removed from assembly.json during processing to save space,
// and we don't need them here in the client.
// See https://github.com/cdklabs/construct-hub/pull/567
export type SlimAssembly = Omit<
  spec.Assembly,
  "types" | "readme" | "dependencyClosure"
>;

/**
 * Fetch assembly of a specific package from the backend.
 */
export const fetchAssembly = async (
  name: string,
  version: string,
  scope?: string
): Promise<SlimAssembly> => {
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
