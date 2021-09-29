import { Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FilterPanel } from "./FilterPanel";
import { SearchResults } from "./SearchResults";
import { SearchStateProvider } from "./SearchState";

export const SearchRedesign: FunctionComponent = () => {
  return (
    <SearchStateProvider>
      <Page
        meta={{
          title: "Search - Construct Hub",
          description: "This is a placeholder",
        }}
        pageName="search"
      >
        <Grid gap={4} p={6} templateColumns="1fr 3fr" templateRows="1fr">
          {/* Filter Panel */}
          <FilterPanel />
          {/* Results, Info,  and Controls */}

          <SearchResults />
        </Grid>
      </Page>
    </SearchStateProvider>
  );
};
