import { SearchBar as SearchBarComponent } from "../../components/SearchBar";
import { FunctionComponent, useState } from "react";
import { useSearchParam } from "./useSearchParam";
import { QUERY_PARAMS } from "../../constants/url";
import { useUpdateSearchParam } from "./useUpdateSearchParam";
import { SEARCH_ANALYTICS } from "./constants";

export const SearchBar: FunctionComponent = () => {
  const query = useSearchParam(QUERY_PARAMS.SEARCH_QUERY);
  const updateSearch = useUpdateSearchParam();

  const [value, setValue] = useState(query ?? "");

  return (
    <SearchBarComponent
      bg="white"
      data-event={SEARCH_ANALYTICS.SEARCH}
      onChange={(e) => setValue(e.target.value)}
      onSubmit={(e) => {
        e.preventDefault();

        updateSearch({
          query: value,
          sort: undefined,
        });
      }}
      value={value}
    />
  );
};
