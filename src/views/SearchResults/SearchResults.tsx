import { Box, Divider, Flex } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Page } from "../../components/Page";
import { Results } from "../../components/Results";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useQueryParams } from "../../hooks/useQueryParams";
import { getSearchPath } from "../../util/url";
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
    defaultQuery: searchQuery ?? undefined,
    defaultLanguage: languageQuery ?? undefined,
  });

  const offset = toNum(queryParams.get(QUERY_PARAMS.OFFSET) ?? "0");

  const { push } = useHistory();

  const { results, page, pageLimit } = useCatalogResults({
    query: searchQuery,
    offset,
    limit: LIMIT,
    language: languageQuery,
  });

  const getUrl = (
    params: Partial<{ [key in SearchQueryParam]: number | string }>
  ) => {
    return getSearchPath({
      query: (params.q ?? searchQuery) as string,
      language: languageQuery ?? undefined,
      offset: params.offset ?? offset,
    });
  };

  useEffect(() => {
    // If the query has results but the page has nothing to show...
    if (results.length && (offset < 0 || offset > pageLimit)) {
      // Handle an out of bounds offset
      if (offset < 0) {
        push(getUrl({ offset: 0 }));
      } else {
        // Offset is too large, just take last page
        push(getUrl({ offset: pageLimit }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, pageLimit, offset]);

  useEffect(() => {
    // Reflect changes to queryParam to search input (specifically for tag clicks)
    if (searchQuery !== searchAPI.query) {
      searchAPI.setQuery(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  return (
    <Page
      meta={{
        title: searchQuery || "Search",
        description: searchQuery
          ? `${results.length} results for ${searchQuery} at Construct Hub`
          : "Search reusable components for your cloud application",
      }}
      pageName="search"
    >
      <Flex direction="column" maxW="100vw">
        <Box p={4}>
          <CatalogSearch {...searchAPI} />
        </Box>
        <Divider />
        <Box p={4}>
          <Flex align="center" justify="space-between" pb={4} wrap="wrap">
            <ShowingDetails
              count={results.length}
              filtered={Boolean(searchQuery)}
              limit={LIMIT}
              offset={offset}
            />
          </Flex>
          <Results language={languageQuery ?? undefined} results={page} />
          <PageControls
            getPageUrl={getUrl}
            limit={LIMIT}
            offset={offset}
            pageLimit={pageLimit}
          />
        </Box>
      </Flex>
    </Page>
  );
};
