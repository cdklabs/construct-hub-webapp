import { getAssetsPath } from "./util";
import { CDKType } from "../../constants/constructs";
import { API_PATHS } from "../../constants/url";
import { PackageTagConfig } from "../config";

export interface ConstructFramework {
  name: CDKType;
  majorVersion?: number;
}

export interface Metadata {
  /**
   * Describes the associated Construct framework for a library.
   * Back-end will introduce a new metadata.constructFrameworks property to replace metadata.constructFramework
   * @deprecated Use constructFrameworks instead
   */
  constructFramework?: Partial<ConstructFramework>;
  /**
   * Describes the associated Construct frameworks for a library.
   * Typically, libraries will be associated with a single framework, though some have no
   * association or multiple associations.
   */
  constructFrameworks?: ConstructFramework[];
  date: string;
  links?: {
    npm: string;
  };
  packageLinks?: {
    [key: string]: string;
  };
  packageTags?: PackageTagConfig[];
}

/**
 * Fetch metadata of a specific package from the backend.
 */
export const fetchMetadata = async (
  name: string,
  version: string,
  scope?: string
): Promise<Metadata> => {
  let sanitizedVersion = version;

  if (sanitizedVersion.startsWith("^")) {
    sanitizedVersion = sanitizedVersion.substring(1, sanitizedVersion.length);
  }

  const metadataPath = `${getAssetsPath(name, version, scope)}${
    API_PATHS.METADATA_SUFFIX
  }`;
  const response = await fetch(metadataPath);

  if (!response.ok) {
    throw new Error(
      `Failed fetching metadata for ${metadataPath}: ${response.statusText}`
    );
  }

  return response.json();
};
