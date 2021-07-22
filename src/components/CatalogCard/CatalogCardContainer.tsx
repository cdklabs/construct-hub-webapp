import { Grid, LinkBox, LinkOverlay } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Card } from "../Card";

const CardContainer: FunctionComponent = ({ children }) => (
  <Card border="1px solid" borderColor="blue.100" h={64} p={0} w="100%">
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

export const CatalogCardContainer: FunctionComponent<{ url?: string }> = ({
  children,
  url,
}) => {
  return url ? (
    <LinkBox>
      <LinkOverlay as={Link} to={url} />
      <CardContainer>{children}</CardContainer>
    </LinkBox>
  ) : (
    <CardContainer>{children}</CardContainer>
  );
};
