import { useMemo } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { SORT_FUNCTIONS } from "../../api/catalog-search/util";
import { FeaturedPackagesDetail } from "../../api/config";
import { CatalogPackage } from "../../api/package/packages";
import { findPackage } from "../../api/package/util";
import { useCatalog } from "../../contexts/Catalog";

export const useSection = ({
  showLastUpdated,
  showPackages,
}: {
  showLastUpdated?: number;
  showPackages?: FeaturedPackagesDetail[];
}) => {
  const { data, loading, error } = useCatalog();

  return useMemo(() => {
    if (loading || error || !data?.packages) return [];

    if (showLastUpdated) {
      return data.packages
        .sort(SORT_FUNCTIONS[CatalogSearchSort.PublishDateDesc])
        .slice(0, showLastUpdated);
    } else if (showPackages) {
      return showPackages
        .map((p) => {
          const pkg = findPackage(data, p.name);
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
  }, [data, error, loading, showLastUpdated, showPackages]);
};
