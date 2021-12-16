import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { LIMIT, SEARCH_ANALYTICS } from "./constants";
import { PageControls } from "./PageControls";
import { SearchBar } from "./SearchBar";
import { SearchDetails } from "./SearchDetails";
import { SortAndFilterDrawer } from "./SortAndFilterDrawer";
import { SortedBy } from "./SortedBy";
import {
  useCdkType,
  useCdkMajor,
  useKeywords,
  useLanguages,
  useOffset,
  useSearchQuery,
  useSort,
  useTags,
} from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

export const SearchResults: FunctionComponent = () => {
  const updateSearch = useUpdateSearchParam();

  const offset = useOffset();
  const query = useSearchQuery();
  const keywords = useKeywords();
  const languages = useLanguages();
  const cdkMajor = useCdkMajor();
  const cdkType = useCdkType();
  const sort = useSort();
  const tags = useTags();

  const { page, pageLimit, results } = useCatalogResults({
    offset,
    limit: LIMIT,
    query,
    keywords,
    languages,
    cdkMajor,
    cdkType,
    sort,
    tags,
  });

  // Resets the page number to 1 if query param offset is below 0, or to the last page if offset is higher than page count
  useEffect(() => {
    // If the query has results but the page has nothing to show...
    if (results.length && (offset < 0 || offset > pageLimit)) {
      // Handle an out of bounds offset
      if (offset < 0) {
        updateSearch({ offset: 0 });
      } else {
        // Offset is too large, just take last page
        updateSearch({ offset: pageLimit });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, offset, pageLimit]);

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
        <SearchBar />

        <Stack
          align={{ base: "start", lg: "center" }}
          direction={{ base: "column-reverse", lg: "row" }}
          justify={{ base: "initial", lg: "space-between" }}
          spacing={4}
        >
          <SearchDetails
            count={results.length}
            filtered={!!query}
            limit={LIMIT}
            offset={offset}
            query={query}
          />

          <Box display={{ base: "none", md: "initial" }}>
            <SortedBy />
          </Box>

          <Box display={{ md: "none" }}>
            <SortAndFilterDrawer />
          </Box>
        </Stack>

        <PackageList data-event={SEARCH_ANALYTICS.RESULTS} items={page} />

        <Box w="full">
          <PageControls offset={offset} pageLimit={pageLimit} />
        </Box>
      </Stack>
    </Page>
  );
};
