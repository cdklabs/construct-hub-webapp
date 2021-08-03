import getConfig from "next/config";
import { getAssetsPath } from "./util";

const { serverRuntimeConfig } = getConfig();
const { apiUrl } = serverRuntimeConfig;

/**
 * Fetch markdown docs of a specific package from the backend.
 */
export const fetchMarkdown = async (
  name: string,
  version: string,
  language: string,
  scope?: string,
  submodule?: string
): Promise<string> => {
  const docsSuffix = `/docs-${submodule ? `${submodule}-` : ""}${language}.md`;

  const markdownPath = `${getAssetsPath(name, version, scope)}${docsSuffix}`;
  const response = await fetch([apiUrl, markdownPath].join(""));
  if (!response.ok) {
    throw new Error(
      `Failed fetching documentation for ${markdownPath}: ${response.statusText}`
    );
  }

  // since CloudFront returns a 200 /index.html for missing documents,
  // we assert the expected docs content type to detect these errors.
  // TODO: switch to proper 404 responses in this case (requires backend changes)
  const expectedContentType = "text/markdown";
  const contentType = response.headers.get("Content-Type");

  // we check 'includes' and not 'equal' because the content type contains
  // charset as well (e.g text/markdown; charset=UTF-8)
  if (!contentType || !contentType.includes(expectedContentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Expected ${expectedContentType}"`
    );
  }
  return response.text();
};
