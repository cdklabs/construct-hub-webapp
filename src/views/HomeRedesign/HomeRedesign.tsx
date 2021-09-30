import { Flex, Grid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { DEFAULT_FEATURED_PACKAGES } from "../../api/config";
import { Page } from "../../components/Page";
import { useConfigValue } from "../../hooks/useConfigValue";
import { Hero } from "./Hero";
import { HomeSection } from "./HomeSection";
import { InfoPanel } from "./InfoPanel";

export const HomeRedesign: FunctionComponent = () => {
  const homePackages = useConfigValue("featuredPackages");
  const sections = (homePackages ?? DEFAULT_FEATURED_PACKAGES).sections;

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
            {sections.map((section) => (
              <HomeSection key={section.name} {...section}></HomeSection>
            ))}
          </Flex>
          <InfoPanel />
        </Grid>
      </Flex>
    </Page>
  );
};
