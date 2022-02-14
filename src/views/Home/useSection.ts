import { useMemo } from "react";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { FeaturedPackagesDetail } from "../../api/config";
import { useSearchContext } from "../../contexts/Search";
import { useCatalog } from "../../hooks/useCatalog";
import { useCatalogResults } from "../../hooks/useCatalogResults";

export const useSection = ({
  showLastUpdated,
  showPackages,
}: {
  showLastUpdated?: number;
  showPackages?: FeaturedPackagesDetail[];
}) => {
  const { isLoading, error } = useCatalog();
  const { results } = useCatalogResults({
    limit: 25,
    sort: CatalogSearchSort.PublishDateDesc,
  });

  const searchInstance = useSearchContext();

  return useMemo(() => {
    if (isLoading || error || !results) return [];

    if (showLastUpdated) {
      return results.slice(0, showLastUpdated);
    } else if (showPackages && searchInstance) {
      return showPackages
        .map((p) => {
          const [pkg] = searchInstance.findByName(p.name, { dedup: true });

          if (pkg) {
            return {
              ...pkg,
              comment: p.comment,
            };
          }
          return undefined;
        })
        .filter((pkg) => pkg !== undefined) as ExtendedCatalogPackage[];
    } else {
      return undefined;
    }
  }, [
    isLoading,
    error,
    results,
    showLastUpdated,
    showPackages,
    searchInstance,
  ]);
};
