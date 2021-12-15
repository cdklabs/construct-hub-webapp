import { FunctionComponent, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PackageList } from "../../components/PackageList";
import { usePagination } from "../../hooks/usePagination";
import { useSearch } from "../../hooks/useSearch";
import {
  offsetState,
  searchParametersSelector,
  searchResultsSelector,
} from "../../state/search";
import { LIMIT, SEARCH_ANALYTICS } from "./constants";

export const Results: FunctionComponent = () => {
  const offset = useRecoilValue(offsetState);
  const params = useRecoilValue(searchParametersSelector);

  const setSearchResults = useSetRecoilState(searchResultsSelector);

  const results = useSearch(params);

  const { page, pageLimit } = usePagination(results, {
    limit: LIMIT,
    offset,
  });

  useEffect(() => {
    setSearchResults({ page, pageLimit, results });
  }, [page, pageLimit, results, setSearchResults]);

  return <PackageList data-event={SEARCH_ANALYTICS.RESULTS} items={page} />;
};
