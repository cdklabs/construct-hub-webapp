import { Center, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FilterPanel } from "./FilterPanel";

export const SearchRedesign: FunctionComponent = () => {
  return (
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

        <Center border="1px solid" borderColor="gray.400">
          {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
          🚧 This section is under construction 🚧
        </Center>
      </Grid>
    </Page>
  );
};
