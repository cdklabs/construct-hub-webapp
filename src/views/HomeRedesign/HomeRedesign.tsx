import { Flex, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { Hero } from "./Hero";
import { InfoPanel } from "./InfoPanel";

export const HomeRedesign: FunctionComponent = () => (
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
      <Grid h="full" p={3} templateColumns="2fr 1fr" templateRows="1fr">
        {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
        <Flex mx="auto">🚧 This section is under construction 🚧</Flex>
        <InfoPanel />
      </Grid>
    </Flex>
  </Page>
);
