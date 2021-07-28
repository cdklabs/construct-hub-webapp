import { useMemo } from "react";
import { Language } from "../../constants/languages";
import { useCatalog } from "../../contexts/Catalog";

export interface UseCatalogResultsOptions {
  limit: number;
  offset: number;
  query: string;
  language: Language | null;
}

/**
 * A hook which encapsulates logic around applying search filters
 * and determining displayable results
 */
export const useCatalogResults = ({
  limit,
  offset,
  query,
  language,
}: UseCatalogResultsOptions) => {
  const { data, loading, error } = useCatalog();

  const results = useMemo(() => {
    if (loading || error || !data?.packages) return [];

    let filtered = data.packages;

    if (query.length) {
      filtered = filtered.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      );
    }

    // Omit TS from filters b/c it is always available
    if (language && language !== Language.TypeScript) {
      filtered = filtered.filter((item) =>
        Object.keys(item.languages).includes(language)
      );
    }

    return filtered.sort((p1, p2) => {
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
