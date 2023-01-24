import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Categories } from "./Categories";
import { CDKTypeTabs } from "./CDKTypeTabs";
import { Featured } from "./Featured";
import { GradientContainer } from "./GradientContainer";
import { Hero } from "./Hero";
import { Info } from "./Info";
import testIds from "./testIds";
import { Page } from "../../components/Page";
import { useCatalog } from "../../hooks/useCatalog";

export const Home: FunctionComponent = () => {
  const { data: catalog } = useCatalog();
  const hasPackages = (catalog?.packages.length ?? 0) > 0;

  return (
    <Page
      meta={{
        title: "Construct Hub",
        description:
          "Construct Hub helps developers find open-source construct libraries for use with AWS CDK, CDK8s, CDKTF and other construct-based tools.",
        suffix: false,
      }}
      pageName="home"
    >
      <GradientContainer
        as={Flex}
        data-testid={testIds.page}
        direction="column"
      >
        <Hero />

        <Info />

        {hasPackages ? (
          <>
            <Categories />
            <CDKTypeTabs />
            <Featured />
          </>
        ) : null}
      </GradientContainer>
    </Page>
  );
};
