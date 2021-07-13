import { Language } from "../../constants/languages";
import { API_PATHS } from "../../constants/url";
import { Metadata } from "./metadata";

export interface Author {
  readonly name: string;
  readonly url: string;
}

export interface CatalogPackage {
  name: string;
  languages: Partial<Record<Language, Record<string, unknown>>>;
  version: string;
  description: string;
  author: Author;
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
  const response = await fetch(API_PATHS.CATALOG_SUFFIX);

  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(`Failed fetching packages index: ${response.statusText}`);
  }

  return response.json();
};
