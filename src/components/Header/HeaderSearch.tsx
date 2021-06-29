import { Input } from "@chakra-ui/react";
import {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
  useEffect,
} from "react";
import { QUERY_PARAMS } from "../../constants/url";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useQueryParams } from "../../hooks/useQueryParams";

export const HeaderSearch: FunctionComponent = () => {
  const queryParams = useQueryParams();
  const searchQuery = queryParams.get(QUERY_PARAMS.SEARCH_QUERY);
  const searchAPI = useCatalogSearch({ defaultQuery: searchQuery ?? "" });

  useEffect(() => {
    if (searchQuery && searchQuery !== searchAPI.query) {
      searchAPI.onQueryChange(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // Only run effect on searchQuery changes

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    searchAPI.onQueryChange(e.target.value);
  };

  const onSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    searchAPI.onSubmit();
  };

  return (
    <form onSubmit={onSearchSubmit}>
      <Input
        name="search"
        onChange={onSearchChange}
        placeholder="Search providers or modules"
        value={searchAPI.query}
      />
    </form>
  );
};
