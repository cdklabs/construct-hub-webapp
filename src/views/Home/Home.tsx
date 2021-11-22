import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { DevPreviewBanner } from "../../components/DevPreviewBanner";
import { Page } from "../../components/Page";
import { useCatalog } from "../../contexts/Catalog";
import { useConfig } from "../../contexts/Config";
import { Categories } from "./Categories";
import { CDKTypeTabs } from "./CDKTypeTabs";
import { Featured } from "./Featured";
import { GradientContainer } from "./GradientContainer";
import { Hero } from "./Hero";
import { Info } from "./Info";
import testIds from "./testIds";

export const Home: FunctionComponent = () => {
  const { data: config } = useConfig();
  const { data: catalog } = useCatalog();
  const fullSite = config?.featureFlags?.fullSite ?? false;
  const hasPackages = (catalog?.packages.length ?? 0) > 0;

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
      <GradientContainer
        as={Flex}
        data-testid={testIds.page}
        direction="column"
      >
        <DevPreviewBanner />

        <Hero />

        <Info />

        {hasPackages && fullSite ? <Categories /> : <></>}

        {hasPackages && fullSite ? <CDKTypeTabs /> : <></>}

        {hasPackages && fullSite ? <Featured /> : <></>}
      </GradientContainer>
    </Page>
  );
};
