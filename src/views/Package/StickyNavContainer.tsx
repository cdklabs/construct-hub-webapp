import { Flex } from "@chakra-ui/react";

export const StickyNavContainer: typeof Flex = ({ offset, ...props }) => (
  <Flex
    alignSelf="stretch"
    as="nav" // to be more semantic
    direction="column"
    display={{ base: "none", lg: "flex" }}
    maxHeight={`calc(100vh - ${offset})`}
    overflow="hidden auto"
    position="sticky"
    {...props}
  />
);
