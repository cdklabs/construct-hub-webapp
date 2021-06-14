import { Grid } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { useState, useEffect } from "react";
import { Documentation } from "../../api/docgen/view/documentation";
import { Card } from "../Card";
import { PackageNav, PackageNavItem } from "../PackageNav";
import { Body } from "./Body";

export interface PackageDocsProps {
  assembly: Assembly;
  language: string;
  submodule?: string;
}

export function appendItem(
  itemTree: PackageNavItem[],
  item: Element
): PackageNavItem[] {
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
}

// We want the nav to be sticky, but it should account for the sticky heading as well
// The calculation here is heading height (72px) + margin-top (16px).
const TOP_OFFSET = "88px";

export function PackageDocs({
  assembly,
  language,
  submodule,
}: PackageDocsProps) {
  const doc = new Documentation({
    assembly: assembly,
    language: language,
    submoduleName: submodule,
  });

  const md = doc.render();
  const source = md.render();
  const [navItems, setNavItems] = useState<PackageNavItem[]>([]);
  useEffect(() => {
    const tree = [
      ...document.querySelectorAll(
        `[data-heading-id][data-heading-title][data-heading-level]`
      ),
    ].reduce(appendItem, []);

    setNavItems(tree);
  }, []);

  return (
    <Grid columnGap={4} pb={4} px={4} templateColumns="1fr 4fr" width="100%">
      {/* Max Height is also limited by header (72px) and marginTop + marginBottom (32px) */}
      <Card
        alignSelf="start"
        maxHeight="calc(100vh - 104px)"
        overflowY="auto"
        position="sticky"
        top={TOP_OFFSET}
      >
        <PackageNav items={navItems} />
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
}
