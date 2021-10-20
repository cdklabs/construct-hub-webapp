import {
  Button,
  Flex,
  forwardRef,
  Heading,
  Tab,
  TabList,
  TabPanelProps,
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

interface PackageTabProps {
  cdkType?: CDKType;
  data: ReturnType<typeof useCatalogResults>;
}

const PackageTab: FunctionComponent<PackageTabProps> = ({ cdkType, data }) => {
  return (
    <Tab isDisabled={data.page.length < 1}>
      {cdkType ? CDKTYPE_RENDER_MAP[cdkType].name : "All CDKs"} (
      {data.results.length})
    </Tab>
  );
};

const PackageTabPanel = forwardRef<PackageTabProps & TabPanelProps, "div">(
  ({ cdkType, data, ...props }, ref) => {
    const { push } = useHistory();

    const onSeeAllClick = () => {
      window.scrollTo(0, 0);
      push(getSearchPath({ cdkType }));
    };

    return (
      <TabPanel ref={ref} {...props} p={0}>
        <PackageGrid packages={data.page} />

        <Flex justify="center" w="full">
          <Button colorScheme="blue" my={8} onClick={onSeeAllClick}>
            See all {cdkType ? CDKTYPE_RENDER_MAP[cdkType].name + " " : ""}
            constructs
          </Button>
        </Flex>
      </TabPanel>
    );
  }
);

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
          <PackageTab data={anyCDKType} />

          <PackageTab cdkType={CDKType.awscdk} data={awscdk} />

          <PackageTab cdkType={CDKType.cdk8s} data={cdk8s} />

          <PackageTab cdkType={CDKType.cdktf} data={cdktf} />
        </TabList>
        <TabPanels minH="28.5rem">
          <PackageTabPanel data={anyCDKType} />

          <PackageTabPanel cdkType={CDKType.awscdk} data={awscdk} />

          <PackageTabPanel cdkType={CDKType.cdk8s} data={cdk8s} />

          <PackageTabPanel cdkType={CDKType.cdktf} data={cdktf} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
