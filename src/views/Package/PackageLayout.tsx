import {
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { PACKAGE_ANALYTICS } from "./constants";
import { DependenciesList } from "./DependenciesList";
import { FeedbackLinks } from "./FeedbackLinks";
import { PackageDocs } from "./PackageDocs";
import { PackageHeader } from "./PackageHeader";
import { usePackageState } from "./PackageState";
import { ShareInfo } from "./ShareInfo";
import testIds from "./testIds";
import { Page } from "../../components/Page";

export const PackageLayout: FunctionComponent = () => {
  const { pageDescription, pageTitle } = usePackageState();

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
  }, [pageTitle]);

  return (
    <Page
      meta={{ title: pageTitle, description: pageDescription }}
      pageName="packageProfile"
    >
      <Grid
        bg="bgPrimary"
        data-testid={testIds.page}
        maxW="100vw"
        templateColumns="1fr"
        templateRows="auto 1fr auto"
      >
        <PackageHeader />

        <Tabs index={tabIndex} onChange={setTabIndex} variant="line">
          <TabList bg="bgSecondary" borderBottom="base" px={{ base: 0, lg: 6 }}>
            <Tab data-event={PACKAGE_ANALYTICS.DOCUMENTATION.TAB}>
              Documentation
            </Tab>
            <Tab
              data-event={PACKAGE_ANALYTICS.DEPENDENCIES.TAB}
              data-testid={testIds.dependenciesTab}
            >
              Dependencies
            </Tab>
            <Tab
              data-event={PACKAGE_ANALYTICS.GITHUB_BADGE.TAB}
              data-testid={testIds.badgeTab}
            >
              Share
            </Tab>
          </TabList>
          <TabPanels maxW="full">
            <TabPanel p={0}>
              <PackageDocs />
            </TabPanel>

            <TabPanel>
              <DependenciesList />
            </TabPanel>

            <TabPanel>
              <ShareInfo />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <FeedbackLinks />
      </Grid>
    </Page>
  );
};
