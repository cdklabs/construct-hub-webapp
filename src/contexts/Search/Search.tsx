import { createContext, FunctionComponent, useContext, useMemo } from "react";
import { CatalogSearchAPI } from "../../api/catalog-search";
import { PageLoader } from "../../components/PageLoader";
import { useCatalog } from "../../contexts/Catalog";

const SearchContext = createContext<CatalogSearchAPI | undefined>(undefined);

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: FunctionComponent = ({ children }) => {
  const { data, loading } = useCatalog();

  const searchAPI = useMemo(() => {
    if (data?.packages === undefined || loading) return;

    const instance = new CatalogSearchAPI(data.packages);
    return instance;
  }, [data, loading]);

  if (!searchAPI) {
    return <PageLoader />;
  }

  return (
    <SearchContext.Provider value={searchAPI}>
      {children}
    </SearchContext.Provider>
  );
};
