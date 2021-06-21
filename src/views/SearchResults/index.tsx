import { Center, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useCatalog } from "../../contexts/Catalog";
import { useQueryParams } from "../../hooks/useQueryParams";
import { LimitDropdown } from "./components/LimitDropdown";
import { PageControls } from "./components/PageControls";
import { Results } from "./components/Results";
import { ShowingDetails } from "./components/ShowingDetails";
import { LIMITS } from "./constants";

const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export function SearchResults() {
  const { data, loading } = useCatalog();

  const queryParams = useQueryParams();
  const query = decodeURIComponent(queryParams.get("q") ?? "");

  const limit = toNum(queryParams.get("limit") ?? `${LIMITS[0]}`);
  const offset = toNum(queryParams.get("offset") ?? "0");

  const { pathname } = useLocation();
  const { push } = useHistory();

  const results = useMemo(
    () =>
      (query.length
        ? data?.packages.filter((item) => JSON.stringify(item).includes(query))
        : data?.packages) ?? [],
    [query, data]
  );

  const pageLimit = Math.floor(results.length / limit);

  const displayable = useMemo(() => {
    const startIndex = (offset > pageLimit ? pageLimit : offset) * limit;
    const stopIndex = startIndex + limit;

    return results.slice(startIndex, stopIndex);
  }, [offset, pageLimit, limit, results]);

  const getUrl = (params: { [key: string]: number }) => {
    const newParams = new URLSearchParams(`${queryParams}`);
    Object.entries(params).forEach(([k, v]) => newParams.set(k, `${v}`));
    return `${pathname}?${newParams}`;
  };

  useEffect(() => {
    // If the query has results but the page has nothing to show...
    if (!loading && (offset < 0 || offset > pageLimit)) {
      // Handle an out of bounds offset
      if (offset < 0) {
        push(getUrl({ offset: 0 }));
      } else {
        // Offset is too large, just take last page
        push(getUrl({ offset: pageLimit }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, results, pageLimit, offset]);

  if (loading) {
    return (
      <Center height="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  const controls = (
    <Flex align="center" justify="space-between" w="100%">
      <ShowingDetails
        count={results.length}
        filtered={!!query}
        limit={limit}
        offset={offset}
      />
      <Flex align="center">
        <LimitDropdown getPageUrl={getUrl} limit={limit} />
        <PageControls
          getPageUrl={getUrl}
          limit={limit}
          offset={offset}
          pageLimit={pageLimit}
        />
      </Flex>
    </Flex>
  );

  return (
    <Flex direction="column" p={4}>
      {controls}
      <Results results={displayable} />
      {controls}
    </Flex>
  );
}
