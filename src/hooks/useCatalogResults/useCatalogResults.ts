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
        JSON.stringify(item).includes(query)
      );
    }

    // Omit TS from filters b/c it is always available
    if (language && language !== Language.TypeScript) {
      filtered = filtered.filter((item) =>
        Object.keys(item.languages).includes(language)
      );
    }

    return filtered;
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
