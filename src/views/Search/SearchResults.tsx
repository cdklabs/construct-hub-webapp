import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { Page } from "../../components/Page";
import {
  offsetState,
  searchParametersSelector,
  searchResultsSelector,
} from "../../state/search";
import { PageControls } from "./PageControls";
import { Results } from "./Results";
import { SearchBar } from "./SearchBar";
import { SearchDetails } from "./SearchDetails";
import { SortAndFilterDrawer } from "./SortAndFilterDrawer";
import { SortedBy } from "./SortedBy";

export const SearchResults: FunctionComponent = () => {
  const [offset, setOffset] = useRecoilState(offsetState);
  const { query } = useRecoilValue(searchParametersSelector);
  const { results, page, pageLimit } = useRecoilValue(searchResultsSelector);

  // Reset offset to 0 if offset is below 0, or to the last if offset is higher than pageLimit
  useEffect(() => {
    // If the query has results but the page has nothing to show
    if (results.length && (offset < 0 || offset > pageLimit)) {
      let nextOffset = pageLimit;

      if (offset < 0) {
        nextOffset = 0;
      }

      setOffset(nextOffset);
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
          <SearchDetails />

          <Box display={{ base: "none", md: "initial" }}>
            <SortedBy />
          </Box>

          <Box display={{ md: "none" }}>
            <SortAndFilterDrawer />
          </Box>
        </Stack>

        <Results />

        <Box w="full">
          <PageControls />
        </Box>
      </Stack>
    </Page>
  );
};
