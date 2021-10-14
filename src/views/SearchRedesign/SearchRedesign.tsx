import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FilterPanel } from "./FilterPanel";
import { SearchResults } from "./SearchResults";
import { SearchStateProvider } from "./SearchState";
import testIds from "./testIds";

export const SearchRedesign: FunctionComponent = () => {
  return (
    <SearchStateProvider>
      <Page
        meta={{
          title: "Search - Construct Hub",
          description:
            "Search Construct Libraries for AWS CDK, CDK8s, and CDKtf",
        }}
        pageName="search"
      >
        <Grid
          data-testid={testIds.page}
          gap={4}
          h="full"
          maxW="100%"
          px={{ base: 0, md: 6 }}
          py={6}
          templateColumns={{ base: "1fr", md: "auto 1fr" }}
          templateRows="1fr"
        >
          {/* Filter Panel Desktop */}
          <FilterPanel />

          {/* Results, Info, and Controls */}
          <SearchResults />
        </Grid>
      </Page>
    </SearchStateProvider>
  );
};
