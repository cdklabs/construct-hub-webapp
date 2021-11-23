import { Language } from "../../constants/languages";
import { API_PATHS } from "../../constants/url";
import { Metadata } from "./metadata";

export interface Author {
  readonly name: string;
  readonly email?: string;
  readonly url: string;
}

export interface CatalogPackage {
  name: string;
  languages?: Partial<Record<Language, Record<string, unknown>>>;
  version: string;
  major: number;
  description: string;
  author: Author | string;
  keywords?: string[];
  metadata: Metadata;
}

export interface Packages {
  packages: CatalogPackage[];
}

const EMPTY_CATALOG = { packages: [] };

/**
 * Fetch the catalog of all packages from the backend.
 */
export const fetchPackages = async (): Promise<Packages> => {
  const response = await fetch(API_PATHS.CATALOG_SUFFIX);

  if (!response.ok) {
    console.error(response.statusText);
    console.warn(
      "Failed to fetch package catalog. Falling back to empty package list."
    );
    return EMPTY_CATALOG;
  }

  return response.json().catch((err) => {
    console.error(err);
    console.warn(
      "Invalid package catalog response. Falling back to empty package list."
    );
    return EMPTY_CATALOG;
  });
};
