import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { NavLink } from "components/NavLink";

export const Title: FunctionComponent = () => (
  <NavLink href="/">
    <Heading as="h1" color="blue.800" size="lg">
      <Box as="span" color="blue.500">
        Construct
      </Box>{" "}
      Hub
    </Heading>
  </NavLink>
);
