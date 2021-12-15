import { FunctionComponent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { SearchBar as SearchBarComponent } from "../../components/SearchBar";
import { queryState, sortState } from "../../state/search";
import { SEARCH_ANALYTICS } from "./constants";

export const SearchBar: FunctionComponent = () => {
  const [, setSort] = useRecoilState(sortState);
  const [query, setQuery] = useRecoilState(queryState);

  const [internalQuery, setInternalQuery] = useState(query);

  useEffect(() => {
    if (query !== internalQuery) {
      setInternalQuery(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <SearchBarComponent
      bg="white"
      data-event={SEARCH_ANALYTICS.SEARCH}
      onChange={(e) => {
        e.preventDefault();
        setInternalQuery(e.target.value);
      }}
      onSubmit={(e) => {
        e.preventDefault();
        setQuery(internalQuery);
        setSort(undefined);
      }}
      value={internalQuery}
    />
  );
};
