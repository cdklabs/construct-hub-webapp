import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import testIds from "./testIds";

export const Title: FunctionComponent = () => (
  <Heading as="h1" color="blue.800" data-testid={testIds.title} size="lg">
    <Link to="/">
      <Box as="span" color="blue.500">
        Construct
      </Box>{" "}
      Hub
    </Link>
  </Heading>
);
