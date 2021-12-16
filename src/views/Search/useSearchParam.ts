import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useQueryParams } from "../../hooks/useQueryParams";
import { parseQueryArray, toNum } from "./util";

const useSearchParam = <T = string | null>(
  key: string,
  transform?: (param: string | null) => T
): T => {
  const queryParams = useQueryParams();
  const qp = queryParams.get(key);

  return useMemo(
    () => (transform ? transform(qp) : (qp as unknown as T)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [qp]
  );
};

export const useCdkType = () => {
  const cdkType: CDKType | undefined =
    useSearchParam(QUERY_PARAMS.CDK_TYPE) ?? undefined;

  return cdkType;
};

export const useCdkMajor = () => {
  const cdkMajor: number | undefined = useSearchParam(
    QUERY_PARAMS.CDK_MAJOR,
    (p) => (p ? toNum(p) : undefined)
  );

  return cdkMajor;
};

export const useKeywords = () => {
  const keywords: string[] = useSearchParam(
    QUERY_PARAMS.KEYWORDS,
    parseQueryArray
  );

  return keywords;
};

export const useLanguages = () => {
  const languages: Language[] = useSearchParam(
    QUERY_PARAMS.LANGUAGES,
    parseQueryArray
  ) as Language[];

  return languages;
};

export const useOffset = () => {
  const offset = useSearchParam(QUERY_PARAMS.OFFSET, (o) => toNum(o ?? ""));
  return offset;
};

export const useSearchQuery = () => {
  const query: string = useSearchParam(QUERY_PARAMS.SEARCH_QUERY) ?? "";
  return query;
};

export const useSort = () => {
  const sort: CatalogSearchSort | undefined =
    useSearchParam(QUERY_PARAMS.SORT) ?? undefined;
  return sort;
};

export const useTags = () => {
  const tags: string[] = useSearchParam(QUERY_PARAMS.TAGS, parseQueryArray);
  return tags;
};
