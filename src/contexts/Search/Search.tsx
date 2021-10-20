import { createContext, FunctionComponent, useContext, useMemo } from "react";
import { CatalogSearchAPI } from "../../api/catalog-search";
import { PageLoader } from "../../components/PageLoader";
import { useCatalog } from "../../contexts/Catalog";
import { useStats } from "../Stats";

const SearchContext = createContext<CatalogSearchAPI | undefined>(undefined);

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: FunctionComponent = ({ children }) => {
  const { data: catalogData, loading: catalogLoading } = useCatalog();
  const { data: statsData, loading: statsLoading } = useStats();

  const searchAPI = useMemo(() => {
    if (catalogData?.packages === undefined || catalogLoading) return;
    if (statsData === undefined || statsLoading) return;

    const instance = new CatalogSearchAPI(catalogData.packages, statsData);
    return instance;
  }, [catalogData, catalogLoading, statsData, statsLoading]);

  if (!searchAPI) {
    return <PageLoader />;
  }

  return (
    <SearchContext.Provider value={searchAPI}>
      {children}
    </SearchContext.Provider>
  );
};
