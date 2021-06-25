import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { Fragment, FunctionComponent } from "react";

const PackageNavItem: FunctionComponent<PackageNavItem> = ({ title, path }) => {
  return (
    <Box>
      <Link href={path}>
        <Text>{title}</Text>
      </Link>
    </Box>
  );
};

const PackageNavItems: FunctionComponent<PackageNavProps> = ({ items }) => {
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
};

export interface PackageNavItem {
  title: string;
  path: string;
  level: number;
  children: PackageNavItem[];
}

export interface PackageNavProps {
  items: PackageNavItem[];
}

export const PackageNav: FunctionComponent<PackageNavProps> = ({ items }) => {
  return (
    <Flex direction="column">
      <PackageNavItems items={items} />
    </Flex>
  );
};
