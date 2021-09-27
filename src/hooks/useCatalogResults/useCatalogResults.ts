import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { Language } from "../../constants/languages";
import { usePagination } from "../usePagination";
import { useSearch } from "../useSearch";

export interface UseCatalogResultsOptions {
  limit: number;
  offset?: number;
  query?: string;
  language?: Language | null;
  sort?: CatalogSearchSort;
}

/**
 * A hook which encapsulates logic around applying search filters
 * and determining displayable results
 */
export const useCatalogResults = ({
  limit,
  offset = 0,
  query = "",
  language = null,
  sort,
}: UseCatalogResultsOptions) => {
  const filters = useMemo(
    () => ({
      language: language ?? undefined,
    }),
    [language]
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
