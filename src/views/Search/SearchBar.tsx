import { FunctionComponent, useState } from "react";
import { SEARCH_ANALYTICS } from "./constants";
import { useSearchQuery } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";
import { SearchBar as SearchBarComponent } from "../../components/SearchBar";

export const SearchBar: FunctionComponent = () => {
  const query = useSearchQuery();
  const updateSearch = useUpdateSearchParam();

  const [value, setValue] = useState(query ?? "");

  return (
    <SearchBarComponent
      bg="bgSecondary"
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
