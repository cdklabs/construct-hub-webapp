import {
  Center,
  Spinner,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FunctionComponent, useState, useEffect } from "react";
import { Page } from "../../components/Page";
import { DependenciesList } from "./DependenciesList";
import { PackageDocs } from "./PackageDocs";
import { PackageDocsError } from "./PackageDocsError";
import { PackageDocsUnsupported } from "./PackageDocsUnsupported";
import { PackageHeader } from "./PackageHeader";
import { usePackageState } from "./PackageState";

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
      <Flex bg="white" direction="column" maxW="100vw">
        <PackageHeader />

        <Flex direction="column" pt={4}>
          <Tabs index={tabIndex} onChange={setTabIndex} variant="line">
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
        </Flex>
      </Flex>
    </Page>
  );
};
