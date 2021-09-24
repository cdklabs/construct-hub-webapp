import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  CatalogPackageWithId,
  CatalogSearchAPI,
} from "../../api/catalog-search";
import { PageLoader } from "../../components/PageLoader";
import { useCatalog } from "../../contexts/Catalog";

type SearchFn = (params: Parameters<CatalogSearchAPI["search"]>[0]) => void;

interface SearchAPI {
  search: SearchFn;
  results: CatalogPackageWithId[];
}

const SearchAPIContext = createContext<SearchAPI | undefined>(undefined);

export const useSearchAPI = () => useContext(SearchAPIContext)!;

export const SearchAPIProvider: FunctionComponent = ({ children }) => {
  const { data, loading } = useCatalog();
  const [results, setResults] = useState<SearchAPI["results"]>([]);

  const searchAPI = useMemo(() => {
    if (data?.packages === undefined || loading) return;

    const instance = new CatalogSearchAPI(data.packages);
    setResults([...instance.search().values()]);
    return instance;
  }, [data, loading]);

  const search: SearchAPI["search"] = useCallback(
    (params) => {
      if (!searchAPI) {
        return;
      }

      const res = searchAPI.search(params);
      setResults([...res.values()]);
    },
    [searchAPI]
  );

  if (!searchAPI) {
    return <PageLoader />;
  }

  return (
    <SearchAPIContext.Provider value={{ results, search }}>
      {children}
    </SearchAPIContext.Provider>
  );
};
