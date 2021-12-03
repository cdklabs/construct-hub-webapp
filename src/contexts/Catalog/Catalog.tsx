import { createContext, FunctionComponent, useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { fetchPackages, Packages } from "../../api/package/packages";

export type CatalogQuery = UseQueryResult<Packages, Error | undefined>;

const CatalogContext = createContext<CatalogQuery | undefined>(undefined);

export const useCatalog = () => useContext(CatalogContext)!;

export const CatalogProvider: FunctionComponent = ({ children }) => {
  const catalogQuery: CatalogQuery = useQuery("catalog", fetchPackages, {
    initialData: {
      packages: [],
    },
  });

  return (
    <CatalogContext.Provider value={catalogQuery}>
      {children}
    </CatalogContext.Provider>
  );
};
