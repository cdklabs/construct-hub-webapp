import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { fetchPackages, Packages } from "../../api/package/packages";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";

const CatalogContext = createContext<UseRequestResponse<Packages>>({
  loading: false,
  data: undefined,
  error: undefined,
});

export const useCatalog = () => useContext(CatalogContext);

export const CatalogProvider: FunctionComponent = ({ children }) => {
  const [requestPackages, catalogResponse] = useRequest(fetchPackages);

  useEffect(() => {
    void requestPackages();
  }, [requestPackages]);

  return (
    <CatalogContext.Provider value={catalogResponse}>
      {children}
    </CatalogContext.Provider>
  );
};
