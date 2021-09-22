import { Flex, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { useCardView } from "../../contexts/CardView";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { FilterPanel } from "./FilterPanel";

export const SearchRedesign: FunctionComponent = () => {
  const { cardView, CardViewControls } = useCardView();

  // This hook's usage should eventually be replaced by a newer Search implementation
  const { displayable, loading } = useCatalogResults({
    limit: 20,
  });

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

        <Flex direction="column">
          <Flex justify="space-between">
            <Flex>This section is under construction.</Flex>
            <CardViewControls />
          </Flex>
          <PackageList
            cardView={cardView}
            items={displayable}
            loading={loading}
          />
        </Flex>
      </Grid>
    </Page>
  );
};
