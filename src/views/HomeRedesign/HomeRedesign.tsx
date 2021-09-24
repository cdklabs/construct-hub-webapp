import { Flex, Grid, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { useCardView } from "../../contexts/CardView";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { Hero } from "./Hero";
import { InfoPanel } from "./InfoPanel";

export const HomeRedesign: FunctionComponent = () => {
  const { cardView, CardViewControls } = useCardView();

  // This hook's usage should eventually be replaced by a newer Search implementation
  const { displayable, loading } = useCatalogResults({
    limit: 10,
  });

  return (
    <Page
      meta={{
        title: "Construct Hub",
        description:
          "Construct Hub helps developers find open-source construct libraries for use with AWS CDK, CDK8s, CDKTf and other construct-based tools.",
        suffix: false,
      }}
      pageName="home"
    >
      <Flex direction="column">
        <Hero />
        <Grid
          gap={3}
          h="full"
          p={3}
          pl={12}
          templateColumns="2fr 1fr"
          templateRows="1fr"
        >
          <Flex direction="column">
            <Flex align="center" justify="space-between" mb={3}>
              <Heading as="h3" color="blue.800" size="md">
                Recently Updated
              </Heading>
              <CardViewControls />
            </Flex>

            <PackageList
              cardView={cardView}
              items={displayable}
              loading={loading}
            />
          </Flex>
          <InfoPanel />
        </Grid>
      </Flex>
    </Page>
  );
};
