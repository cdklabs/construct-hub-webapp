import { Flex, Grid, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PackageList } from "../../components/PackageList";
import { Page } from "../../components/Page";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { Hero } from "./Hero";
import { InfoPanel } from "./InfoPanel";

export const HomeRedesign: FunctionComponent = () => {
  const { page } = useCatalogResults({
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
            <Heading as="h3" color="blue.800" mb={3} size="md">
              Recently Updated
            </Heading>

            <PackageList items={page} />
          </Flex>
          <InfoPanel />
        </Grid>
      </Flex>
    </Page>
  );
};
