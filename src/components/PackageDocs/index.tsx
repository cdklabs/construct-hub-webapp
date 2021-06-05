import { Flex, Box } from "@chakra-ui/react";
import * as reflect from "jsii-reflect";
import { useState, useEffect } from "react";
import { Documentation } from "../../api/docgen/view/documentation";
import { PackageNav, PackageNavItem } from "../PackageNav";
import { Body } from "./Body";

export interface PackageDocsProps {
  assembly: reflect.Assembly;
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

export function PackageDocs(props: PackageDocsProps) {
  const doc = new Documentation({
    assembly: props.assembly,
    language: props.language,
    submoduleName: props.submodule,
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
    <Flex bg="gray.100" width="100%">
      <Box top={0} position="sticky" height="100vh" width="20%">
        <PackageNav items={navItems} />
      </Box>
      <Box bg="white" p={4} width="80%">
        <Body>{source}</Body>
      </Box>
    </Flex>
  );
}
