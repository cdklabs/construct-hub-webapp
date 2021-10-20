/**
 * @fileoverview Exposes page-level state and setters to all components in the new SearchResults View.
 */
import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { QUERY_PARAMS } from "../../constants/url";
import {
  UseCatalogSearchReturn,
  useCatalogSearch,
} from "../../hooks/useCatalogSearch";
import { useQueryParams } from "../../hooks/useQueryParams";
import { LIMIT } from "../SearchResults/constants";
import { parseLangs, toNum } from "./util";

export interface SearchState {
  limit: number;
  offset: number;
  query: string;
  searchAPI: UseCatalogSearchReturn;
}

const SearchStateContext = createContext<SearchState | undefined>(undefined);

/**
 * A hook to access Search Page specific state. This can only be in descendants of the new Search Page
 * and will otherwise throw an error.
 */
export const useSearchState = () => {
  const state = useContext(SearchStateContext);

  if (!state) {
    throw new Error(
      `This hook must be called in a child of <SearchStateProvider />`
    );
  }

  return state;
};

export const SearchStateProvider: FunctionComponent = ({ children }) => {
  const queryParams = useQueryParams();

  const offset = toNum(queryParams.get(QUERY_PARAMS.OFFSET) ?? "0");

  const query = decodeURIComponent(
    queryParams.get(QUERY_PARAMS.SEARCH_QUERY) ?? ""
  );

  const languages = parseLangs(queryParams.get(QUERY_PARAMS.LANGUAGES));

  const sort = (queryParams.get(QUERY_PARAMS.SORT) ?? undefined) as
    | CatalogSearchSort
    | undefined;

  const cdkType =
    (queryParams.get(QUERY_PARAMS.CDK_TYPE) as CDKType) ?? undefined;

  const cdkMajorParam = queryParams.get(QUERY_PARAMS.CDK_MAJOR);
  const cdkMajor = cdkMajorParam ? toNum(cdkMajorParam) : undefined;

  const searchAPI = useCatalogSearch({
    defaultCdkMajor: cdkMajor,
    defaultCdkType: cdkType,
    defaultLanguages: languages,
    defaultQuery: query,
    defaultSort: sort,
  });

  useEffect(() => {
    if (query !== searchAPI.query) {
      searchAPI.setQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <SearchStateContext.Provider
      value={{
        limit: LIMIT,
        offset,
        query,
        searchAPI,
      }}
    >
      {children}
    </SearchStateContext.Provider>
  );
};
