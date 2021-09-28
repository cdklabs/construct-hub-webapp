/**
 * @fileoverview Exposes page-level state and setters to all components in the new SearchResults View.
 */
import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import type { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import {
  UseCatalogSearchReturn,
  useCatalogSearch,
} from "../../hooks/useCatalogSearch";
import { useQueryParams } from "../../hooks/useQueryParams";
import { LIMIT } from "../SearchResults/constants";

export interface SearchState {
  limit: number;
  offset: number;
  query: string;
  searchAPI: UseCatalogSearchReturn;
  sort?: CatalogSearchSort;
}

const SearchStateContext = createContext<SearchState | undefined>(undefined);

export const useSearchState = () => {
  const state = useContext(SearchStateContext);

  if (!state) {
    throw new Error(
      `This hook must be called in a child of <SearchStateProvider />`
    );
  }

  return state;
};

const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

const parseLangs = (langQuery: string | null) => {
  if (!langQuery) return [];

  const langs = decodeURIComponent(langQuery).split(",");
  return langs as Language[];
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

  const searchAPI = useCatalogSearch({
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
        sort,
      }}
    >
      {children}
    </SearchStateContext.Provider>
  );
};
