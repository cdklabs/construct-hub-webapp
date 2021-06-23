import { getAssetsPath } from "./util";

export interface Metadata {
  date: string;
}

export async function fetchMetadata(
  name: string,
  version: string,
  scope?: string
): Promise<Metadata> {
  let sanitizedVersion = version;

  if (sanitizedVersion.startsWith("^")) {
    sanitizedVersion = sanitizedVersion.substring(1, sanitizedVersion.length);
  }

  const metadataPath = `${getAssetsPath(name, version, scope)}/metadata.json`;
  const response = await fetch(metadataPath);

  if (!response.ok) {
    throw new Error(
      `Failed fetching metadata for ${metadataPath}: ${response.statusText}`
    );
  }

  return response.json();
}
