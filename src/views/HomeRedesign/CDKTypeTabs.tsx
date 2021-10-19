import {
  Button,
  Flex,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import { PackageGrid } from "./PackageGrid";

const SeeAll: FunctionComponent<{ path: string }> = ({ children, path }) => {
  const { push } = useHistory();

  const onClick = () => {
    window.scrollTo(0, 0);
    push(path);
  };

  return (
    <Flex justify="center" w="full">
      <Button colorScheme="blue" my={8} onClick={onClick}>
        {children}
      </Button>
    </Flex>
  );
};

export const CDKTypeTabs: FunctionComponent = () => {
  const anyCDKType = useCatalogResults({ limit: 4 });
  const awscdk = useCatalogResults({ cdkType: CDKType.awscdk, limit: 4 });
  const cdk8s = useCatalogResults({ cdkType: CDKType.cdk8s, limit: 4 });
  const cdktf = useCatalogResults({ cdkType: CDKType.cdktf, limit: 4 });

  return (
    <Flex
      bg="white"
      color="blue.800"
      direction="column"
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
    >
      <Heading
        as="h3"
        fontSize="1.5rem"
        fontWeight="semibold"
        lineHeight="lg"
        mb={3}
      >
        Find open-source community constructs and official libraries in one
        location
      </Heading>
      <Text lineHeight="md" maxW="60ch" mb={5}>
        Use Construct Hub to find CDKs’ libraries owned by the open source
        community and companies and organizations like Terraform, CNCF, AWS and
        more.
      </Text>
      <Tabs isFitted variant="line">
        <TabList>
          <Tab>All CDKs ({anyCDKType.results.length})</Tab>

          <Tab isDisabled={awscdk.page.length < 1}>
            {CDKTYPE_RENDER_MAP["aws-cdk"].name} ({awscdk.results.length})
          </Tab>

          <Tab isDisabled={cdk8s.page.length < 1}>
            {CDKTYPE_RENDER_MAP.cdk8s.name} ({cdk8s.results.length})
          </Tab>

          <Tab isDisabled={cdktf.page.length < 1}>
            {CDKTYPE_RENDER_MAP.cdktf.name} ({cdktf.results.length})
          </Tab>
        </TabList>
        <TabPanels minH="28.5rem">
          <TabPanel p={0}>
            <PackageGrid packages={anyCDKType.page} />
            <SeeAll path={getSearchPath({})}>See all constructs</SeeAll>
          </TabPanel>
          <TabPanel p={0}>
            <PackageGrid packages={awscdk.page} />
            <SeeAll path={getSearchPath({ cdkType: CDKType.awscdk })}>
              See all {CDKTYPE_RENDER_MAP["aws-cdk"].name} constructs
            </SeeAll>
          </TabPanel>
          <TabPanel p={0}>
            <PackageGrid packages={cdk8s.page} />
            <SeeAll path={getSearchPath({ cdkType: CDKType.cdk8s })}>
              See all {CDKTYPE_RENDER_MAP.cdk8s.name} constructs
            </SeeAll>
          </TabPanel>
          <TabPanel p={0}>
            <PackageGrid packages={cdktf.page} />
            <SeeAll path={getSearchPath({ cdkType: CDKType.cdktf })}>
              See all {CDKTYPE_RENDER_MAP.cdktf.name} constructs
            </SeeAll>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
