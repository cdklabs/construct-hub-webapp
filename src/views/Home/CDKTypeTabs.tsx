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
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { NavLink } from "../../components/NavLink";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useHistoryState } from "../../hooks/useHistoryState";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import { PackageGrid } from "./PackageGrid";
import testIds from "./testIds";

interface PackageTabProps {
  cdkType?: CDKType;
  data: ReturnType<typeof useCatalogResults>;
}

const PackageTab: FunctionComponent<PackageTabProps> = ({ cdkType, data }) => {
  return (
    <Tab
      data-testid={testIds.cdkTypeTab}
      data-value={cdkType}
      isDisabled={data.page.length < 1}
    >
      {cdkType ? CDKTYPE_RENDER_MAP[cdkType].name : "All CDKs"} (
      {data.results.length})
    </Tab>
  );
};

const PackageTabPanel = forwardRef<PackageTabProps & TabPanelProps, "div">(
  ({ cdkType, data, ...props }, ref) => {
    return (
      <TabPanel data-testid={testIds.cdkTypeGrid} ref={ref} {...props} p={0}>
        <PackageGrid packages={data.page} />

        <Flex justify="center" w="full">
          <NavLink
            data-testid={testIds.cdkTypeSeeAllButton}
            onClick={() => window.scrollTo(0, 0)}
            to={getSearchPath({
              cdkType,
              sort: cdkType
                ? CatalogSearchSort.DownloadsDesc
                : CatalogSearchSort.PublishDateDesc,
            })}
          >
            <Button colorScheme="blue" my={8}>
              See all {cdkType ? CDKTYPE_RENDER_MAP[cdkType].name + " " : ""}
              constructs
            </Button>
          </NavLink>
        </Flex>
      </TabPanel>
    );
  }
);

export const CDKTypeTabs: FunctionComponent = () => {
  const anyCDKType = useCatalogResults({
    limit: 4,
  });
  const awscdk = useCatalogResults({
    cdkType: CDKType.awscdk,
    limit: 4,
    sort: CatalogSearchSort.DownloadsDesc,
  });
  const cdk8s = useCatalogResults({
    cdkType: CDKType.cdk8s,
    limit: 4,
    sort: CatalogSearchSort.DownloadsDesc,
  });
  const cdktf = useCatalogResults({
    cdkType: CDKType.cdktf,
    limit: 4,
    sort: CatalogSearchSort.DownloadsDesc,
  });

  const [tabIndex, setTabIndex] = useHistoryState("cdkTypeTab", 0);

  return (
    <Flex
      bg="white"
      color="blue.800"
      data-testid={testIds.cdkTypeSection}
      direction="column"
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
      zIndex="0"
    >
      <Heading
        as="h3"
        data-testid={testIds.cdkTypeSectionHeading}
        fontSize="1.5rem"
        fontWeight="semibold"
        lineHeight="lg"
        mb={3}
      >
        Find open-source community constructs and official libraries in one
        location
      </Heading>
      <Text
        data-testid={testIds.cdkTypeSectionDescription}
        lineHeight="md"
        maxW="60ch"
        mb={5}
      >
        Use Construct Hub to find CDKs’ libraries owned by the open source
        community and companies and organizations like Terraform, CNCF, AWS and
        more.
      </Text>
      <Tabs
        defaultIndex={tabIndex}
        isFitted
        onChange={(index) => setTabIndex(index)}
        variant="line"
      >
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
