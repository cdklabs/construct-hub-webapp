import getConfig from "next/config";
import { Language } from "../../constants/languages";
import { API_PATHS } from "../../constants/url";
import { Metadata } from "./metadata";

const { serverRuntimeConfig } = getConfig();
const { apiUrl } = serverRuntimeConfig;

export interface Author {
  readonly name: string;
  readonly url: string;
}

export interface CatalogPackage {
  name: string;
  languages: Partial<Record<Language, Record<string, unknown>>>;
  version: string;
  description: string;
  author: Author | string;
  keywords: string[];
  metadata: Metadata;
}

export interface Packages {
  packages: CatalogPackage[];
}

/**
 * Fetch the catalog of all packages from the backend.
 */
export const fetchPackages = async (): Promise<Packages> => {
  const response = await fetch([apiUrl, API_PATHS.CATALOG_SUFFIX].join(""));

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Failed fetching packages index: ${response.statusText}`);
  }

  return response.json();
};
