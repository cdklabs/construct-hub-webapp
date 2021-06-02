import { Box, Flex, Text } from "@chakra-ui/react";
import { Fragment } from "react";

function PackageNavItem({ title, path }: PackageNavItem) {
  return (
    <Box>
      <a href={path}>
        <Text>{title}</Text>
      </a>
    </Box>
  );
}

function PackageNavItems({ items }: PackageNavProps) {
  return (
    <Flex direction="column" paddingLeft={4}>
      {items.map((item) => {
        return (
          <Fragment key={item.path}>
            <PackageNavItem {...item} />
            <PackageNavItems items={item.children} />
          </Fragment>
        );
      })}
    </Flex>
  );
}

export interface PackageNavItem {
  title: string;
  path: string;
  level: number;
  children: PackageNavItem[];
}

export interface PackageNavProps {
  items: PackageNavItem[];
}

export function PackageNav({ items }: PackageNavProps) {
  return (
    <Flex direction="column" paddingRight={4}>
      <PackageNavItems items={items} />
    </Flex>
  );
}
