import { API_PATHS } from "../../constants/url";
import { getAssetsPath } from "./util";

export interface Metadata {
  date: string;
  links?: {
    npm: string;
  };
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
