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
import { ROUTES } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useHistoryState } from "../../hooks/useHistoryState";
import { getSearchPath } from "../../util/url";
import { SECTION_PADDING } from "./constants";
import { PackageGrid } from "./PackageGrid";
import testIds from "./testIds";

interface PackageTabProps {
  data: ReturnType<typeof useCatalogResults>;
  label: string;
}

interface PackageTabPanelProps extends PackageTabProps, TabPanelProps {
  tag: string;
}

const tabs = {
  community: {
    label: "Community",
    tag: "community",
  },
  aws: {
    label: "AWS",
    tag: "aws-official",
  },
  hashicorp: {
    label: "HashiCorp",
    tag: "hashicorp-official",
  },
};

const PackageTab: FunctionComponent<PackageTabProps> = ({ data, label }) => {
  return (
    <Tab
      data-testid={testIds.cdkTypeTab}
      data-value={label}
      isDisabled={data.page.length < 1}
    >
      {label}
    </Tab>
  );
};

const PackageTabPanel = forwardRef<PackageTabPanelProps, "div">(
  ({ label, data, tag, ...props }, ref) => {
    return (
      <TabPanel data-testid={testIds.cdkTypeGrid} ref={ref} {...props} p={0}>
        <PackageGrid packages={data.page} />

        <Flex justify="center" w="full">
          <NavLink
            data-testid={testIds.cdkTypeSeeAllButton}
            onClick={() => window.scrollTo(0, 0)}
            to={getSearchPath({
              tags: tag ? [tag] : undefined,
              sort: CatalogSearchSort.DownloadsDesc,
            })}
          >
            <Button colorScheme="blue" my={8}>
              See all {label} constructs
            </Button>
          </NavLink>
        </Flex>
      </TabPanel>
    );
  }
);

export const CDKTypeTabs: FunctionComponent = () => {
  const community = useCatalogResults({
    tags: [tabs.community.tag],
    limit: 4,
    sort: CatalogSearchSort.DownloadsDesc,
  });

  const aws = useCatalogResults({
    tags: [tabs.aws.tag],
    limit: 4,
    sort: CatalogSearchSort.DownloadsDesc,
  });
  const hashicorp = useCatalogResults({
    tags: [tabs.hashicorp.tag],
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
        mb={2}
      >
        Find constructs by publisher
      </Heading>
      <Text
        data-testid={testIds.cdkTypeSectionDescription}
        lineHeight="md"
        mb={5}
      >
        Find constructs published by the open-source community, AWS, and
        HashiCorp in one location. You can also have your own construct
        libraries listed on Construct Hub by publishing them on npm registry.
        More concrete guidance can be found in the{" "}
        <NavLink color="blue.500" to={ROUTES.CONTRIBUTE}>
          Contribute
        </NavLink>{" "}
        page.
      </Text>
      <Tabs
        defaultIndex={tabIndex}
        onChange={(index) => setTabIndex(index)}
        variant="line"
      >
        <TabList>
          <PackageTab data={community} label={tabs.community.label} />

          <PackageTab data={aws} label={tabs.aws.label} />

          <PackageTab data={hashicorp} label={tabs.hashicorp.label} />
        </TabList>
        <TabPanels minH="28.5rem">
          <PackageTabPanel
            data={community}
            label={tabs.community.label.toLowerCase()}
            tag={tabs.community.tag}
          />

          <PackageTabPanel
            data={aws}
            label={tabs.aws.label}
            tag={tabs.aws.tag}
          />

          <PackageTabPanel
            data={hashicorp}
            label={tabs.hashicorp.label}
            tag={tabs.hashicorp.tag}
          />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
