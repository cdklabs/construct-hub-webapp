import { useMemo } from "react";
import type { CatalogSearchAPI } from "../../api/catalog-search";
import { useSearchContext } from "../../contexts/Search";

export const useSearch = ({
  query,
  filters,
  sort,
}: Parameters<CatalogSearchAPI["search"]>[0] = {}) => {
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
        })
        .values(),
    ],
    [instance, query, filters, sort]
  );

  return results;
};
