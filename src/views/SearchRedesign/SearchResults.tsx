import { Divider, Flex, Stack } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { SearchBar } from "../../components/SearchBar";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useDebounce } from "../../hooks/useDebounce";
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
  const debouncedQuery = useDebounce(searchAPI.query);

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
  }, [debouncedQuery, sort, languages, cdkType, cdkMajor]);

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
          hasButton
          onChange={searchAPI.onQueryChange}
          onSubmit={searchAPI.onSubmit}
          value={searchAPI.query}
        />

        <Divider />

        <Flex justify="space-between">
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
      </Stack>
    </Page>
  );
};
