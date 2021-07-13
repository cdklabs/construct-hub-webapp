import { Box, Flex, Grid } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { useState, useEffect, useMemo, FunctionComponent } from "react";
import { Documentation } from "../../../../api/docgen/view/documentation";
import { Markdown } from "../../../../components/Markdown";
import { NavTree, NavItemConfig } from "../../../../components/NavTree";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { ChooseSubmodule } from "../ChooseSubmodule";

export interface PackageDocsProps {
  assembly: Assembly;
  language: string;
  submodule?: string;
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

const isDev = process.env.NODE_ENV === "development";

export const PackageDocs: FunctionComponent<PackageDocsProps> = ({
  assembly,
  language,
  submodule,
}) => {
  const q = useQueryParams();

  const hasApiReference = !isDev || (isDev && q.get("apiRef") !== "false");

  const source = useMemo(() => {
    const timeLabel = `Timer | docgen(${assembly.name}${
      submodule ? `.${submodule}` : ""
    })`;
    console.time(timeLabel);
    const doc = new Documentation({
      apiReference: hasApiReference,
      assembly: assembly,
      language: language,
      submoduleName: submodule,
    });

    const md = doc.render();
    const s = md.render();
    console.timeEnd(timeLabel);
    return s;
  }, [hasApiReference, assembly, language, submodule]);

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
      templateColumns="1fr 3fr"
      width="100%"
    >
      <Flex
        alignSelf="stretch"
        borderRight="1px solid"
        borderRightColor="gray.100"
        direction="column"
        maxHeight={`calc(100vh - ${TOP_OFFSET})`}
        overflow="hidden auto"
        p={0}
        position="sticky"
        top={TOP_OFFSET}
      >
        <Box
          borderBottom="1px solid"
          borderColor="gray.100"
          justify="center"
          p={0}
        >
          <ChooseSubmodule assembly={assembly} />
        </Box>
        <Box overflowY="auto">
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
            height: "40px",
            marginTop: `-40px`,
            visibility: "hidden",
          },
        }}
      >
        <Markdown>{source}</Markdown>
      </Box>
    </Grid>
  );
};
