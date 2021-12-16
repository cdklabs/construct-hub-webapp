import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";

export const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export const parseQueryArray = <T extends string>(
  queryString: string | null
) => {
  if (!queryString) return [];

  return decodeURIComponent(queryString).split(",") as T[];
};

const getParamFromUrl = (key: string) => {
  if (typeof window === "undefined") return null;
  const queryParams = new URL(window.location.href).searchParams;
  return queryParams.get(key);
};

export const getSearchUrlParams = () => {
  return {
    query: getParamFromUrl(QUERY_PARAMS.SEARCH_QUERY) ?? "",
    keywords: parseQueryArray(getParamFromUrl(QUERY_PARAMS.KEYWORDS)),
    cdkType: (getParamFromUrl(QUERY_PARAMS.CDK_TYPE) as CDKType) ?? undefined,
    cdkMajor: (() => {
      const cdkMajorParam = getParamFromUrl(QUERY_PARAMS.CDK_MAJOR);
      return cdkMajorParam ? toNum(cdkMajorParam) : undefined;
    })(),
    languages: parseQueryArray(
      getParamFromUrl(QUERY_PARAMS.LANGUAGES)
    ) as Language[],
    offset: toNum(getParamFromUrl(QUERY_PARAMS.OFFSET) ?? ""),
    sort:
      (getParamFromUrl(QUERY_PARAMS.SORT) as CatalogSearchSort) ?? undefined,
    tags: parseQueryArray(getParamFromUrl(QUERY_PARAMS.TAGS)),
  };
};
