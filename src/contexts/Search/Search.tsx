import { createContext, FunctionComponent, useContext, useMemo } from "react";
import { CatalogSearchAPI } from "../../api/catalog-search";
import { PageLoader } from "../../components/PageLoader";
import { useCatalog } from "../../hooks/useCatalog";
import { useStats } from "../../hooks/useStats";

const SearchContext = createContext<CatalogSearchAPI | undefined>(undefined);

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: FunctionComponent = ({ children }) => {
  const catalog = useCatalog();
  const stats = useStats();

  const searchAPI = useMemo(() => {
    if (catalog.data?.packages === undefined || catalog.isLoading) return;
    if (stats.data === undefined || stats.isLoading) return;

    const instance = new CatalogSearchAPI(catalog.data.packages, stats.data);
    return instance;
  }, [catalog.data, catalog.isLoading, stats.data, stats.isLoading]);

  if (!searchAPI) {
    return <PageLoader />;
  }

  return (
    <SearchContext.Provider value={searchAPI}>
      {children}
    </SearchContext.Provider>
  );
};
