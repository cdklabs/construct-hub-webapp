import { Box, Flex, Grid } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { useState, useEffect, FunctionComponent, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Markdown } from "../../../../components/Markdown";
import { NavTree, NavItemConfig } from "../../../../components/NavTree";
import { ChooseSubmodule } from "../ChooseSubmodule";

export interface PackageDocsProps {
  markdown: string;
  assembly: Assembly;
}

type Item = NavItemConfig & { level: number; children: Item[] };

export const appendItem = (itemTree: Item[], item: Element): Item[] => {
  if (!(item instanceof HTMLElement)) {
    return itemTree;
  }

  const { headingId, headingLevel = "100" } = item.dataset;
  const { innerText } = item;
  const level = parseInt(headingLevel);

  // Don't create nav items for items with no title / url
  if (level > 3 || !innerText || !headingId) {
    return itemTree;
  }

  const last = itemTree[itemTree.length - 1];

  if (last == null || last.level >= level) {
    return [
      ...itemTree,
      {
        display: innerText,
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
const TOP_OFFSET = "4.5rem";

export const PackageDocs: FunctionComponent<PackageDocsProps> = ({
  markdown: source,
  assembly,
}) => {
  const [navItems, setNavItems] = useState<Item[]>([]);

  useEffect(() => {
    const tree = [
      ...document.querySelectorAll(
        `[data-heading-id][data-heading-title][data-heading-level]`
      ),
    ].reduce(appendItem, []);

    setNavItems(tree);
  }, [source]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(`${hash}`) as HTMLElement;
      target?.scrollIntoView(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const markdown = useMemo(
    () => <Markdown repository={assembly.repository}>{source}</Markdown>,
    [assembly.repository, source]
  );

  return (
    <Grid
      bg="white"
      columnGap={4}
      h="100%"
      templateColumns={{ base: "1fr", md: "1fr 3fr" }}
      width="100%"
    >
      <Flex
        alignSelf="stretch"
        borderRight="1px solid"
        borderRightColor="blue.50"
        direction="column"
        display={{ base: "none", md: "flex" }}
        maxHeight={`calc(100vh - ${TOP_OFFSET})`}
        overflow="hidden auto"
        position="sticky"
        px={4}
        top={TOP_OFFSET}
      >
        {Object.keys(assembly?.submodules ?? {}).length > 0 && (
          <Flex
            borderBottom="1px solid"
            borderColor="blue.50"
            justify="center"
            py={4}
          >
            <ChooseSubmodule assembly={assembly} />
          </Flex>
        )}
        <Box overflowY="auto" py={4}>
          <NavTree items={navItems} />
        </Box>
      </Flex>
      <Box
        h="max-content"
        maxWidth="100%"
        overflow="hidden"
        py={4}
        sx={{
          a: {
            scrollMarginTop: TOP_OFFSET,
          },
        }}
      >
        {markdown}
      </Box>
    </Grid>
  );
};
