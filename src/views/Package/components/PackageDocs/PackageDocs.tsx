import { Box, Flex, Grid } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { useState, useEffect, FunctionComponent } from "react";
import { NavTree, NavItemConfig } from "../../../../components/NavTree";
import { ChooseSubmodule } from "../ChooseSubmodule";
import { Body } from "./Body";

export interface PackageDocsProps {
  markdown: string;
  assembly: Assembly;
}

type Item = NavItemConfig & { level: number; children: Item[] };

export const appendItem = (itemTree: Item[], item: Element): Item[] => {
  if (!(item instanceof HTMLElement)) {
    return itemTree;
  }

  const { headingId, headingTitle = "", headingLevel = "100" } = item.dataset;
  const level = parseInt(headingLevel);
  if (level > 3) {
    return itemTree;
  }

  const last = itemTree[itemTree.length - 1];
  if (typeof last === "undefined" || last.level === level) {
    return [
      ...itemTree,
      {
        display: headingTitle,
        url: `#${headingId}`,
        level,
        children: [],
      },
    ];
  } else {
    last.children = appendItem(last.children, item);
    return itemTree;
  }
};

// We want the nav to be sticky, but it should account for the sticky heading as well, which is 72px
const TOP_OFFSET = "72px";

export const PackageDocs: FunctionComponent<PackageDocsProps> = ({
  markdown,
  assembly,
}) => {
  const source = markdown;

  const [navItems, setNavItems] = useState<Item[]>([]);

  useEffect(() => {
    const tree = [
      ...document.querySelectorAll(
        `[data-heading-id][data-heading-title][data-heading-level]`
      ),
    ].reduce(appendItem, []);

    setNavItems(tree);
  }, [source]);

  return (
    <Grid
      bg="white"
      borderTop="1px solid"
      borderTopColor="gray.100"
      columnGap={4}
      h="100%"
      templateColumns={["1fr", null, "1fr 3fr"]}
      width="100%"
    >
      <Flex
        alignSelf="stretch"
        borderRight="1px solid"
        borderRightColor="gray.100"
        direction="column"
        display={["none", null, "flex"]}
        maxHeight={`calc(100vh - ${TOP_OFFSET})`}
        overflow="hidden auto"
        p={0}
        position="sticky"
        top={TOP_OFFSET}
      >
        <Flex
          borderBottom="1px solid"
          borderColor="gray.100"
          justify="center"
          py={4}
        >
          <ChooseSubmodule assembly={assembly} />
        </Flex>
        <Box overflowY="auto" pt={4}>
          <NavTree items={navItems} />
        </Box>
      </Flex>
      <Box
        maxWidth="100%"
        overflow="hidden"
        p={4}
        sx={{
          // Offsets the target link to account for sticky Header
          "a:target:before": {
            content: `""`,
            display: "block",
            height: TOP_OFFSET,
            marginTop: `calc(-1 * ${TOP_OFFSET})`,
            visibility: "hidden",
          },
        }}
      >
        <Body>{source}</Body>
      </Box>
    </Grid>
  );
};
