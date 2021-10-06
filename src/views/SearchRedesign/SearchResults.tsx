import { Box, Divider, Flex } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useRef } from "react";
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
import { SortedBy } from "./SortedBy";

export const SearchResults: FunctionComponent = () => {
  const isFirstRender = useRef(true);
  const { push } = useHistory();

  const { query, searchAPI, offset, limit } = useSearchState();
  const { languages, sort, cdkType, cdkMajor, onSearch } = searchAPI;

  const { page, pageLimit, results } = useCatalogResults({
    offset,
    limit,
    query,
    languages,
    cdkMajor,
    cdkType,
    sort,
  });

  const getUrl = (
    params: Partial<{ [key in SearchQueryParam]: number | string }>
  ) => {
    return getSearchPath({
      cdkMajor,
      cdkType,
      query: (params.q ?? query) as string,
      languages,
      sort,
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

  // Reset offset and update url when filters & sort change
  // We want to avoid doing this on first render / when a user directly navigates to a search URL
  // so we keep a ref to prevent this
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      onSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, languages, cdkType, cdkMajor]);

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
      <Flex direction="column" maxW="100%">
        <Box px={4}>
          <CatalogSearch {...searchAPI} />
          <Divider mt={4} />
        </Box>
        <Box p={4}>
          <Flex justify="space-between" pb={4}>
            <ShowingDetails
              count={results.length}
              filtered={!!query}
              limit={limit}
              offset={offset}
            />
            <SortedBy />
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
