import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useQueryParams } from "../../hooks/useQueryParams";
import { offsetState, searchParametersSelector } from "../../state/search";
import { parseQueryArray, toNum } from "./util";

/**
 * Sets the initial url state to search state
 */
export const useInitialUrlState = () => {
  const queryParams = useQueryParams();
  const setSearchParams = useSetRecoilState(searchParametersSelector);
  const setOffset = useSetRecoilState(offsetState);

  const offset = toNum(queryParams.get(QUERY_PARAMS.OFFSET) ?? "0");

  const query = decodeURIComponent(
    queryParams.get(QUERY_PARAMS.SEARCH_QUERY) ?? ""
  );

  const languages: Language[] = parseQueryArray(
    queryParams.get(QUERY_PARAMS.LANGUAGES)
  );

  const tagQuery = queryParams.get(QUERY_PARAMS.TAGS);

  const keywordQuery = queryParams.get(QUERY_PARAMS.KEYWORDS);

  const sort = (queryParams.get(QUERY_PARAMS.SORT) ?? undefined) as
    | CatalogSearchSort
    | undefined;

  const cdkType =
    (queryParams.get(QUERY_PARAMS.CDK_TYPE) as CDKType) ?? undefined;

  const cdkMajorParam = queryParams.get(QUERY_PARAMS.CDK_MAJOR);
  const cdkMajor = cdkMajorParam ? toNum(cdkMajorParam) : undefined;

  // On mount, set state from URL Params
  useEffect(() => {
    setSearchParams({
      query,
      sort,
      filters: {
        languages,
        tags: parseQueryArray(tagQuery),
        keywords: parseQueryArray(keywordQuery),
        cdkType,
        cdkMajor,
      },
    });

    setOffset(offset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
