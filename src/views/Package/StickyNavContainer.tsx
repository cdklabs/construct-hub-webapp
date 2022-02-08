import { Flex, FlexProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface StickyNavContainerProps extends FlexProps {
  offset: string | number;
}

export const StickyNavContainer: FunctionComponent<StickyNavContainerProps> = ({
  offset,
  ...props
}) => (
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
