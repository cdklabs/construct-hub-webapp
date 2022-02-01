import type { Schema } from "jsii-docgen";
import { getAssetsPath } from "./util";

/**
 * Fetch markdown docs of a specific package from the backend.
 */
export const fetchMarkdownDocs = async (
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

/**
 * Fetch JSON docs of a specific package from the backend.
 */
export const fetchJsonDocs = async (
  name: string,
  version: string,
  language: string,
  scope?: string,
  submodule?: string
): Promise<Schema> => {
  const docsSuffix = `/docs-${
    submodule ? `${submodule}-` : ""
  }${language}.json`;

  const jsonPath = `${getAssetsPath(name, version, scope)}${docsSuffix}`;
  const response = await fetch(jsonPath);
  if (!response.ok) {
    throw new Error(
      `Failed fetching documentation for ${jsonPath}: ${response.statusText}`
    );
  }

  // since CloudFront returns a 200 /index.html for missing documents,
  // we assert the expected docs content type to detect these errors.
  // TODO: switch to proper 404 responses in this case (requires backend changes)
  const expectedContentType = "application/json";
  const contentType = response.headers.get("Content-Type");

  // we check 'includes' and not 'equal' because the content type contains
  // charset as well (e.g text/markdown; charset=UTF-8)
  if (!contentType || !contentType.includes(expectedContentType)) {
    throw new Error(
      `Invalid content type: ${contentType}. Expected ${expectedContentType}"`
    );
  }

  return response.json();
};
