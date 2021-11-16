import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { usePagination } from "../usePagination";
import { useSearch } from "../useSearch";

export interface UseCatalogResultsOptions {
  cdkMajor?: number;
  cdkType?: CDKType;
  keywords?: string[];
  limit: number;
  offset?: number;
  query?: string;
  language?: Language | null;
  languages?: Language[];
  sort?: CatalogSearchSort;
  tags?: string[];
  dedup?: boolean;
}

/**
 * A hook to wrap `useSearch` results with pagination and parameter memoization
 * This hook depends on an upstream provider - `<SearchProvider />`, which wraps all pages.
 */
export const useCatalogResults = ({
  cdkMajor,
  cdkType,
  keywords,
  limit,
  offset = 0,
  query = "",
  language = null,
  languages,
  sort,
  tags,
  dedup = false,
}: UseCatalogResultsOptions) => {
  const filters = useMemo(
    () => ({
      cdkMajor,
      cdkType,
      keywords,
      language: language ?? undefined,
      languages,
      tags,
    }),
    [cdkMajor, cdkType, keywords, language, languages, tags]
  );

  const results = useSearch({
    filters,
    query,
    sort,
    dedup,
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
