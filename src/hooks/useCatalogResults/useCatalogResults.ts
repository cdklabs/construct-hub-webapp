import { useMemo } from "react";
import { Language } from "../../constants/languages";
import { useCatalog } from "../../contexts/Catalog";

export interface UseCatalogResultsOptions {
  limit: number;
  offset?: number;
  query?: string;
  language?: Language | null;
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
}: UseCatalogResultsOptions) => {
  const { data, loading, error } = useCatalog();

  const results = useMemo(() => {
    if (loading || error || !data?.packages) return [];

    const filtered = data.packages.filter((item) => {
      // Filter out items which do not support the current language
      if (language && language !== Language.TypeScript) {
        if (!Object.keys(item.languages).includes(language)) {
          return false;
        }
      }

      // Filter items which do not match the current query
      if (query.length) {
        const itemStr = JSON.stringify(item).toLowerCase();
        const queryStr = query.toLowerCase();

        if (!itemStr.includes(queryStr)) {
          return false;
        }
      }

      return true;
    });

    // Next sort by most recently updated. (The sort should eventually become a parameter)
    return [...filtered].sort((p1, p2) => {
      const d1 = new Date(p1.metadata.date);
      const d2 = new Date(p2.metadata.date);
      if (d1 === d2) {
        return 0;
      }
      return d1 < d2 ? 1 : -1;
    });
  }, [data?.packages, error, language, loading, query]);

  const pageLimit = results ? Math.floor(results.length / limit) : 0;

  const displayable = useMemo(() => {
    const startIndex = (offset > pageLimit ? pageLimit : offset) * limit;
    const stopIndex = startIndex + limit;

    return results.slice(startIndex, stopIndex);
  }, [limit, offset, pageLimit, results]);

  return useMemo(
    () => ({ loading, results, error, displayable, pageLimit }),
    [displayable, error, loading, pageLimit, results]
  );
};
