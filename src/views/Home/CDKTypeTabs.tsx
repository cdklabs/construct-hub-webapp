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
import { eventName } from "../../contexts/Analytics";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useHistoryState } from "../../hooks/useHistoryState";
import { getSearchPath } from "../../util/url";
import { HOME_ANALYTICS, SECTION_PADDING } from "./constants";
import { PackageGrid } from "./PackageGrid";
import testIds from "./testIds";

interface PackageTabProps {
  "data-event": string;
  data: ReturnType<typeof useCatalogResults>;
  label: string;
}

interface PackageTabPanelProps extends PackageTabProps, TabPanelProps {
  tag: string;
}

const tabs = {
  community: {
    "data-event": HOME_ANALYTICS.PUBLISHER.eventName("Community"),
    label: "Community",
    tag: "community",
  },
  aws: {
    "data-event": HOME_ANALYTICS.PUBLISHER.eventName("AWS"),
    label: "AWS",
    tag: "aws-published",
  },
  hashicorp: {
    "data-event": HOME_ANALYTICS.PUBLISHER.eventName("HashiCorp"),
    label: "HashiCorp",
    tag: "hashicorp-published",
  },
};

const PackageTab: FunctionComponent<PackageTabProps> = ({
  "data-event": dataEvent,
  data,
  label,
}) => {
  return (
    <Tab
      data-event={eventName(dataEvent, "Tab")}
      data-testid={testIds.cdkTypeTab}
      data-value={label}
      isDisabled={data.page.length < 1}
    >
      {label}
    </Tab>
  );
};

const PackageTabPanel = forwardRef<PackageTabPanelProps, "div">(
  ({ "data-event": dataEvent, label, data, tag, ...props }, ref) => {
    return (
      <TabPanel data-testid={testIds.cdkTypeGrid} ref={ref} {...props} p={0}>
        <PackageGrid data-event={dataEvent} packages={data.page} />

        <Flex justify="center" w="full">
          <Button
            as={NavLink}
            colorScheme="blue"
            data-event={eventName(dataEvent, "See All")}
            data-testid={testIds.cdkTypeSeeAllButton}
            my={8}
            onClick={() => window.scrollTo(0, 0)}
            to={getSearchPath({
              tags: tag ? [tag] : undefined,
              sort: CatalogSearchSort.DownloadsDesc,
            })}
          >
            See all {label} constructs
          </Button>
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
        Search by publisher
      </Heading>
      <Text
        data-testid={testIds.cdkTypeSectionDescription}
        lineHeight="md"
        mb={5}
      >
        Find constructs published by the open-source community, AWS, and cloud
        technology providers in one location. You can also include your own
        construct libraries on Construct Hub by publishing them on npm registry.
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
          <PackageTab data={community} {...tabs.community} />

          <PackageTab data={aws} {...tabs.aws} />

          <PackageTab data={hashicorp} {...tabs.hashicorp} />
        </TabList>
        <TabPanels minH="28.5rem">
          <PackageTabPanel
            data={community}
            {...tabs.community}
            label={tabs.community.label.toLowerCase()}
          />

          <PackageTabPanel data={aws} {...tabs.aws} />

          <PackageTabPanel data={hashicorp} {...tabs.hashicorp} />
        </TabPanels>
      </Tabs>
    </Flex>
  );
};
