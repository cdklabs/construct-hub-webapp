import { useMemo } from "react";
import type { CatalogSearchParams } from "../../api/catalog-search";
import { useSearchContext } from "../../contexts/Search";

/**
 * A hook which returns a list of packages returned by the CatalogSearchAPI.
 * Generally this hook will be called via `useCatalogSearchResults` which wraps this functionality with pagination
 * This hook depends on an upstream provider - `<SearchProvider />`, which wraps all pages.
 */
export const useSearch = ({
  query,
  filters,
  sort,
  exactQuery,
}: CatalogSearchParams = {}) => {
  const instance = useSearchContext();

  if (!instance) {
    throw new Error(
      "This hook can only be called within a descendant of a <SearchProvider />"
    );
  }

  const results = useMemo(
    () => [
      ...instance
        .search({
          query,
          filters,
          sort,
          exactQuery,
        })
        .values(),
    ],
    [instance, query, filters, sort, exactQuery]
  );

  return results;
};
