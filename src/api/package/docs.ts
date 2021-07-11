import { getAssetsPath } from "./util";

export const fetchMarkdown = async (
  name: string,
  version: string,
  language: string,
  scope?: string,
  submodule?: string
): Promise<string> => {
  const docsSuffix = `/docs-${submodule ? `${submodule}-` : ""}${language}.md`;

  const markdownPath = `${getAssetsPath(name, version, scope)}${docsSuffix}`;
  const response = await fetch(markdownPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching documentation for ${markdownPath}: ${response.statusText}`
    );
  }
  return response.text();
};
