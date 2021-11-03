import {
  Center,
  Spinner,
  Grid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { Page } from "../../components/Page";
import { DependenciesList } from "./DependenciesList";
import { FeedbackLinks } from "./FeedbackLinks";
import { PackageDocs } from "./PackageDocs";
import { PackageDocsError } from "./PackageDocsError";
import { PackageDocsUnsupported } from "./PackageDocsUnsupported";
import { PackageHeader } from "./PackageHeader";
import { usePackageState } from "./PackageState";
import testIds from "./testIds";

export const PackageLayout: FunctionComponent = () => {
  const {
    assembly,
    hasDocs,
    hasError,
    isLoadingDocs,
    isSupported,
    markdown,
    pageDescription,
    pageTitle,
  } = usePackageState();

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
        bg="white"
        data-testid={testIds.page}
        maxW="100vw"
        templateColumns="1fr"
        templateRows="auto 1fr auto"
      >
        <PackageHeader />

        <Tabs index={tabIndex} onChange={setTabIndex} pt={4} variant="line">
          <TabList borderBottom="base" mx={{ base: 0, lg: 6 }}>
            <Tab>Documentation</Tab>
            <Tab>Dependencies</Tab>
          </TabList>
          <TabPanels maxW="full">
            <TabPanel p={0}>
              {/* Readme and Api Reference Area */}
              {isSupported ? (
                hasError ? (
                  <PackageDocsError />
                ) : isLoadingDocs ? (
                  <Center minH="16rem">
                    <Spinner size="xl" />
                  </Center>
                ) : (
                  hasDocs && (
                    <PackageDocs
                      assembly={assembly.data!}
                      markdown={markdown.data!}
                    />
                  )
                )
              ) : (
                <PackageDocsUnsupported />
              )}
            </TabPanel>

            <TabPanel>
              <DependenciesList />
            </TabPanel>
          </TabPanels>
        </Tabs>

        <FeedbackLinks />
      </Grid>
    </Page>
  );
};
