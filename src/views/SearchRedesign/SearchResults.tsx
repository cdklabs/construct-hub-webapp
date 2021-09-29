import { Box, Divider, Flex } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CatalogSearch } from "../../components/CatalogSearch";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { getSearchPath } from "../../util/url";
import { PageControls } from "../SearchResults/components/PageControls";
import { ShowingDetails } from "../SearchResults/components/ShowingDetails";
import { SearchQueryParam } from "../SearchResults/constants";
import { useSearchState } from "./SearchState";

export const SearchResults: FunctionComponent = () => {
  const { push } = useHistory();

  const { query, sort, searchAPI, offset, limit } = useSearchState();

  const { page, pageLimit, results } = useCatalogResults({
    offset,
    limit,
    query,
    languages: searchAPI.languages,
    cdkType: searchAPI.cdkType,
    sort: sort ?? undefined,
  });

  const getUrl = (
    params: Partial<{ [key in SearchQueryParam]: number | string }>
  ) => {
    return getSearchPath({
      cdkType: searchAPI.cdkType,
      query: (params.q ?? query) as string,
      languages: searchAPI.languages,
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
  }, [results, offset, pageLimit]);

  return (
    <Page
      meta={{
        title: query || "Search",
        description: query
          ? `${results.length} results for ${query} at Construct Hub`
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
          <Flex justify="space-between" pb={4}>
            <ShowingDetails
              count={results.length}
              filtered={!!query}
              limit={limit}
              offset={offset}
            />
          </Flex>
          <PackageList items={page} />
          <PageControls
            getPageUrl={getUrl}
            limit={limit}
            offset={offset}
            pageLimit={pageLimit}
          />
        </Box>
      </Flex>
    </Page>
  );
};
