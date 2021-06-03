import { getAssetsPath } from "./util";

type UserInfo = {
  username: string;
  email: string;
};

export interface Metadata {
  name: string;
  scope: "unscoped" | string;
  version: string;
  description: string;
  keywords: string[];
  date: string;
  links: {
    npm: string;
    homepage: string;
    repository: string;
    bugs: string;
  };
  author: UserInfo & {
    name: string;
  };
  publisher: UserInfo;
  maintainers: UserInfo[];
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
      `Failed fetching assembly for ${metadataPath}: ${response.statusText}`
    );
  }

  return response.json();
}
