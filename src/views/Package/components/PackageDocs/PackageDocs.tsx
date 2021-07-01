import { Box, Flex, Grid } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { useState, useEffect, useMemo, FunctionComponent } from "react";
import { Documentation } from "../../../../api/docgen/view/documentation";
import { Card } from "../../../../components/Card";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { ChooseSubmodule } from "../ChooseSubmodule";
import { PackageNav, PackageNavItem } from "../PackageNav";
import { Body } from "./Body";

export interface PackageDocsProps {
  assembly: Assembly;
  language: string;
  submodule?: string;
}

export const appendItem = (
  itemTree: PackageNavItem[],
  item: Element
): PackageNavItem[] => {
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
        title: headingTitle,
        path: `#${headingId}`,
        level,
        children: [],
      },
    ];
  } else {
    last.children = appendItem(last.children, item);
    return itemTree;
  }
};

// We want the nav to be sticky, but it should account for the sticky heading as well
// The calculation here is heading height (72px) + margin-top (16px).
const TOP_OFFSET = "88px";

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

  const [navItems, setNavItems] = useState<PackageNavItem[]>([]);

  useEffect(() => {
    const tree = [
      ...document.querySelectorAll(
        `[data-heading-id][data-heading-title][data-heading-level]`
      ),
    ].reduce(appendItem, []);

    setNavItems(tree);
  }, [source]);

  return (
    <Grid columnGap={4} templateColumns="1fr 4fr" width="100%">
      <Card
        alignSelf="stretch"
        as={Flex}
        direction="column"
        maxHeight="calc(100vh - 104px)"
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
          <PackageNav items={navItems} />
        </Box>
      </Card>
      <Card
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
        <Body>{source}</Body>
      </Card>
    </Grid>
  );
};
