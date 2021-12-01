import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { SearchBar } from "../../components/SearchBar";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { getSearchPath } from "../../util/url";
import { SearchQueryParam } from "../SearchRedesign/constants";
import { PageControls } from "./PageControls";
import { SearchDetails } from "./SearchDetails";
import { useSearchState } from "./SearchState";
import { SortAndFilterDrawer } from "./SortAndFilterDrawer";
import { SortedBy } from "./SortedBy";

export const SearchResults: FunctionComponent = () => {
  const isFirstRender = useRef(true);
  const { push } = useHistory();

  const { query, searchAPI, offset, limit } = useSearchState();
  const { keywords, languages, sort, cdkType, cdkMajor, onSearch, tags } =
    searchAPI;

  const { page, pageLimit, results } = useCatalogResults({
    offset,
    limit,
    query,
    keywords,
    languages,
    cdkMajor,
    cdkType,
    sort,
    tags,
  });

  const getUrl = (
    params: Partial<{ [key in SearchQueryParam]: number | string }>
  ) => {
    return getSearchPath({
      cdkMajor,
      cdkType,
      keywords,
      query: (params.q ?? query) as string,
      languages,
      sort,
      offset: params.offset ?? offset,
      tags,
    });
  };

  // Resets the page number to 1 if query param offset is below 0, or to the last page if offset is higher than page count
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

  // Reset offset and update url when query, filters, or sort change
  // We want to avoid doing this on first render / when a user directly navigates to a search URL
  // so we keep a ref to prevent this
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      // Trigger a history replace rather than push to avoid bloating browser history
      onSearch({ replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, keywords, languages, cdkType, cdkMajor, tags]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
      <Stack direction="column" maxW="100vw" pb={4} px={4} spacing={4}>
        <SearchBar
          bg="white"
          onChange={searchAPI.onQueryChange}
          onSubmit={(e) => {
            searchAPI.setSort(undefined);
            searchAPI.onSubmit(e);
          }}
          value={searchAPI.query}
        />

        <Stack
          align={{ base: "start", lg: "center" }}
          direction={{ base: "column-reverse", lg: "row" }}
          justify={{ base: "initial", lg: "space-between" }}
          spacing={4}
        >
          <SearchDetails
            count={results.length}
            filtered={!!query}
            limit={limit}
            offset={offset}
          />

          <Box display={{ base: "none", md: "initial" }}>
            <SortedBy />
          </Box>

          <Box display={{ md: "none" }}>
            <SortAndFilterDrawer />
          </Box>
        </Stack>

        <PackageList items={page} />

        <Box w="full">
          <PageControls
            getPageUrl={getUrl}
            offset={offset}
            pageLimit={pageLimit}
          />
        </Box>
      </Stack>
    </Page>
  );
};
