import {
  Center,
  Spinner,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Page } from "../../components/Page";
import { FeedbackLinks } from "./FeedbackLinks";
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

  return (
    <Page
      meta={{ title: pageTitle, description: pageDescription }}
      pageName="packageProfile"
    >
      <Flex bg="white" direction="column" maxW="100vw">
        <PackageHeader />

        <Tabs variant="line">
          <TabList
            borderBottom="1px solid"
            borderBottomColor="blue.50"
            mt={4}
            mx={{ base: 0, lg: 6 }}
            overflowX="auto"
          >
            <Tab>Documentation</Tab>
            <Tab isDisabled>
              <Tooltip hasArrow label="Coming Soon!" placement="top">
                Dependencies
              </Tooltip>
            </Tab>
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
            <TabPanel>Coming Soon</TabPanel>
          </TabPanels>
        </Tabs>
        <FeedbackLinks />
      </Flex>
    </Page>
  );
};
