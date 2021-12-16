import { Box, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { LIMIT, SEARCH_ANALYTICS } from "./constants";
import { PageControls } from "./PageControls";
import { SearchBar } from "./SearchBar";
import { SearchDetails } from "./SearchDetails";
import { SortAndFilterDrawer } from "./SortAndFilterDrawer";
import { SortedBy } from "./SortedBy";
import { useSearchParam } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";
import { parseQueryArray, toNum } from "./util";

export const SearchResults: FunctionComponent = () => {
  const updateSearch = useUpdateSearchParam();

  const offset = useSearchParam(QUERY_PARAMS.OFFSET, (o) => toNum(o ?? ""));

  const query = useSearchParam(QUERY_PARAMS.SEARCH_QUERY) ?? "";

  const keywords = useSearchParam(QUERY_PARAMS.KEYWORDS, parseQueryArray);

  const languages = useSearchParam(
    QUERY_PARAMS.LANGUAGES,
    parseQueryArray
  ) as Language[];

  const cdkMajor = useSearchParam(QUERY_PARAMS.CDK_MAJOR, (major) =>
    major ? toNum(major) : undefined
  );

  const cdkType = useSearchParam(QUERY_PARAMS.CDK_TYPE) as CDKType;

  const sort = useSearchParam(QUERY_PARAMS.SORT) as CatalogSearchSort;

  const tags = useSearchParam(QUERY_PARAMS.TAGS, parseQueryArray);

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
