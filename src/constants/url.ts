export const API_PATHS = {
  PACKAGES_PREFIX: "/data",
  CATALOG_SUFFIX: "/catalog.json",
  ASSEMBLY_SUFFIX: "/assembly.json",
  METADATA_SUFFIX: "/metadata.json",
  CONFIG: "/config.json",
  STATS: "/stats.json",
} as const;

export const QUERY_PARAMS = {
  CDK_TYPE: "cdk",
  LANGUAGE: "lang",
  LANGUAGES: "langs",
  OFFSET: "offset",
  SEARCH_QUERY: "q",
  SORT: "sort",
  SUBMODULE: "submodule",
  CDK_MAJOR: "cdkver",
} as const;

export const ROUTES = {
  FAQ: "/faq",
  HOME: "/",
  PACKAGES: "/packages",
  SEARCH: "/search",
  SITE_TERMS: "/terms",
};

type QueryParams = typeof QUERY_PARAMS;

export type QueryParamKey = QueryParams[keyof QueryParams];
