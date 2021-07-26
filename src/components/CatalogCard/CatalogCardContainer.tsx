import { Grid, LinkBox } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Card } from "../Card";

const CardContainer: FunctionComponent = ({ children }) => (
  <Card h={64} p={0} w="100%">
    <Grid
      as="article"
      h="100%"
      overflow="hidden"
      templateColumns="1fr"
      templateRows="2fr 1fr"
    >
      {children}
    </Grid>
  </Card>
);

export const CatalogCardContainer: FunctionComponent<{ isLink?: boolean }> = ({
  children,
  isLink,
}) => {
  return isLink ? (
    <LinkBox
      _hover={{
        "> :first-child": {
          bg: "gray.50",
        },
      }}
    >
      <CardContainer>{children}</CardContainer>
    </LinkBox>
  ) : (
    <CardContainer>{children}</CardContainer>
  );
};
