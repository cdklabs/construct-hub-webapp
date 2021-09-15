import { Box, Center, Divider, Flex, Spinner } from "@chakra-ui/react";
import { FunctionComponent, useEffect, lazy, Suspense } from "react";
import { useHistory } from "react-router-dom";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Page } from "../../components/Page";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useCardView } from "../../contexts/CardView";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useConfigValue } from "../../hooks/useConfigValue";
import { useQueryParams } from "../../hooks/useQueryParams";
import { getSearchPath } from "../../util/url";
import { PageControls } from "./components/PageControls";
import { ShowingDetails } from "./components/ShowingDetails";
import { LIMIT, SearchQueryParam } from "./constants";

const Results = lazy(() => import("../../components/Results"));
const PackageList = lazy(() => import("../../components/PackageList"));

const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export const SearchResults: FunctionComponent = () => {
  const queryParams = useQueryParams();
  const featureFlags = useConfigValue("featureFlags");
  const { cardView, CardViewControls } = useCardView();

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
    return getSearchPath({
      query: (params.q ?? searchQuery) as string,
      language: languageQuery,
      offset: params.offset ?? offset,
    });
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
              filtered={!!searchQuery}
              limit={LIMIT}
              offset={offset}
            />
            {featureFlags?.showNewCards && <CardViewControls />}
          </Flex>
          {featureFlags?.showNewCards ? (
            <Suspense
              fallback={
                <Center>
                  <Spinner size="xl"></Spinner>
                </Center>
              }
            >
              <PackageList
                cardView={cardView}
                items={displayable}
                loading={loading}
              />
            </Suspense>
          ) : (
            <Suspense
              fallback={
                <Center>
                  <Spinner size="xl"></Spinner>
                </Center>
              }
            >
              <Results
                language={languageQuery ?? undefined}
                results={displayable}
                skeleton={{ loading, noOfItems: LIMIT }}
              />
            </Suspense>
          )}
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
