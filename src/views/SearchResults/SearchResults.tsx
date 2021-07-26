import { Box, Divider, Flex } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Results } from "../../components/Results";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useQueryParams } from "../../hooks/useQueryParams";
import { PageControls } from "./components/PageControls";
import { ShowingDetails } from "./components/ShowingDetails";
import { LIMIT, SearchQueryParam } from "./constants";

const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export const SearchResults: FunctionComponent = () => {
  const queryParams = useQueryParams();

  const searchQuery = decodeURIComponent(
    queryParams.get(QUERY_PARAMS.SEARCH_QUERY) ?? ""
  );

  const languageQuery = queryParams.get(
    QUERY_PARAMS.LANGUAGE
  ) as Language | null;

  const searchAPI = useCatalogSearch({
    defaultQuery: searchQuery,
    defaultLanguage: languageQuery,
  });

  const offset = toNum(queryParams.get(QUERY_PARAMS.OFFSET) ?? "0");

  const { pathname } = useLocation();
  const { push } = useHistory();

  const { results, displayable, loading, pageLimit } = useCatalogResults({
    query: searchQuery,
    offset,
    limit: LIMIT,
    language: languageQuery,
  });

  const getUrl = (
    params: Partial<{ [key in SearchQueryParam]: number | string }>
  ) => {
    const newParams = new URLSearchParams(`${queryParams}`);
    Object.entries(params).forEach(([k, v]) => newParams.set(k, `${v}`));
    return `${pathname}?${newParams}`;
  };

  useEffect(() => {
    // If the query has results but the page has nothing to show...
    if (!loading && results.length && (offset < 0 || offset > pageLimit)) {
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

  return (
    <Flex direction="column" maxW="100vw">
      <Box px={4} py={4}>
        <CatalogSearch {...searchAPI} />
      </Box>
      <Divider />
      <Box px={4} py={4}>
        <Box pb={4}>
          <ShowingDetails
            count={results.length}
            filtered={!!searchQuery}
            limit={LIMIT}
            offset={offset}
          />
        </Box>
        <Results
          results={displayable}
          skeleton={{ loading, noOfItems: LIMIT }}
        />
        <PageControls
          getPageUrl={getUrl}
          limit={LIMIT}
          offset={offset}
          pageLimit={pageLimit}
        />
      </Box>
    </Flex>
  );
};
