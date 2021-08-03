export const API_PATHS = {
  PACKAGES_PREFIX: "/data",
  CATALOG_SUFFIX: "/catalog.json",
  ASSEMBLY_SUFFIX: "/assembly.json",
  METADATA_SUFFIX: "/metadata.json",
} as const;

export const QUERY_PARAMS = {
  LANGUAGE: "lang",
  OFFSET: "offset",
  SEARCH_QUERY: "q",
  SUBMODULE: "submodule",
} as const;

export const ROUTES = {
  FAQ: "/faq",
  HOME: "/",
  PACKAGES: "/packages",
  PACKAGE: "/package",
  SEARCH: "/search",
  SITE_TERMS: "/terms",
};

type QueryParams = typeof QUERY_PARAMS;

export type QueryParamKey = QueryParams[keyof QueryParams];
