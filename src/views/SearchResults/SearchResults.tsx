import { Box, Divider, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Page } from "../../components/Page";
import { Results } from "../../components/Results";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
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
  const { query: search, push } = useRouter();

  const searchQuery = decodeURIComponent(
    (search[QUERY_PARAMS.SEARCH_QUERY] as string) ?? ""
  );

  const languageQuery = search[QUERY_PARAMS.LANGUAGE] as Language | null;

  const searchAPI = useCatalogSearch({
    defaultQuery: searchQuery,
    defaultLanguage: languageQuery,
  });

  const offset = toNum((search[QUERY_PARAMS.OFFSET] as string) ?? "0");

  const { results, displayable, pageLimit } = useCatalogResults({
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
      language: languageQuery,
      offset: params.offset ?? offset,
    });
  };

  useEffect(() => {
    // If the query has results but the page has nothing to show...
    if (results.length && (offset < 0 || offset > pageLimit)) {
      // Handle an out of bounds offset
      if (offset < 0) {
        void push(getUrl({ offset: 0 }));
      } else {
        // Offset is too large, just take last page
        void push(getUrl({ offset: pageLimit }));
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
    <Page pageName="search">
      <Flex direction="column" maxW="100vw">
        <Box p={4}>
          <CatalogSearch {...searchAPI} />
        </Box>
        <Divider />
        <Box p={4}>
          <Box pb={4}>
            <ShowingDetails
              count={results.length}
              filtered={!!searchQuery}
              limit={LIMIT}
              offset={offset}
            />
          </Box>
          <Results
            language={languageQuery ?? undefined}
            results={displayable}
          />
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
