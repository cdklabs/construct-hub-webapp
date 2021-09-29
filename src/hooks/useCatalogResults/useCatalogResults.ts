import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { usePagination } from "../usePagination";
import { useSearch } from "../useSearch";

export interface UseCatalogResultsOptions {
  cdkType?: CDKType;
  limit: number;
  offset?: number;
  query?: string;
  language?: Language | null;
  languages?: Language[];
  sort?: CatalogSearchSort;
}

/**
 * A hook to wrap `useSearch` results with pagination and parameter memoization
 * This hook depends on an upstream provider - `<SearchProvider />`, which wraps all pages.
 */
export const useCatalogResults = ({
  cdkType,
  limit,
  offset = 0,
  query = "",
  language = null,
  languages,
  sort,
}: UseCatalogResultsOptions) => {
  const filters = useMemo(
    () => ({
      cdkType,
      language: language ?? undefined,
      languages: languages,
    }),
    [cdkType, language, languages]
  );

  const results = useSearch({
    filters,
    query,
    sort,
  });

  const { page, pageLimit } = usePagination(results, {
    offset,
    limit,
  });

  return useMemo(
    () => ({ results, page, pageLimit }),
    [page, pageLimit, results]
  );
};
