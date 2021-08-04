import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import testIds from "./testIds";
import { NavLink } from "components/NavLink";

export const Title: FunctionComponent = () => (
  <Heading
    as="h1"
    color="blue.800"
    data-testid={testIds.title}
    size="lg"
    wordBreak="keep-all"
  >
    <NavLink _hover={{ textDecoration: "none" }} href="/">
      <Box as="span" color="blue.500">
        Construct
      </Box>{" "}
      Hub
    </NavLink>
  </Heading>
);
