import { useQuery, UseQueryResult } from "react-query";
import { fetchPackages, Packages } from "../../api/package/packages";

export type CatalogQuery = UseQueryResult<Packages, Error | undefined>;

export const useCatalog = () => {
  const catalogQuery: CatalogQuery = useQuery("catalog", fetchPackages, {
    initialData: {
      packages: [],
    },
  });

  return catalogQuery;
};
