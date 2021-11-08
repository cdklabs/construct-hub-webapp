import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { FeaturedPackagesDetail } from "../../api/config";
import { CatalogPackage } from "../../api/package/packages";
import { findPackage } from "../../api/package/util";
import { useCatalog } from "../../contexts/Catalog";
import { useCatalogResults } from "../../hooks/useCatalogResults";

export const useSection = ({
  showLastUpdated,
  showPackages,
}: {
  showLastUpdated?: number;
  showPackages?: FeaturedPackagesDetail[];
}) => {
  const { loading, error } = useCatalog();
  const { results } = useCatalogResults({
    limit: 25,
    sort: CatalogSearchSort.PublishDateDesc,
  });

  return useMemo(() => {
    if (loading || error || !results) return [];

    if (showLastUpdated) {
      return results.slice(0, showLastUpdated);
    } else if (showPackages) {
      return showPackages
        .map((p) => {
          const pkg = findPackage({ packages: results }, p.name);
          if (pkg) {
            return {
              ...pkg,
              comment: p.comment,
            };
          }
          return undefined;
        })
        .filter((pkg) => pkg !== undefined) as CatalogPackage[];
    } else {
      return undefined;
    }
  }, [results, error, loading, showLastUpdated, showPackages]);
};
