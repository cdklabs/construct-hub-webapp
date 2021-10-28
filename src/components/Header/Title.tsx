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
    <Box
      as="span"
      color="gray.600"
      fontSize={["xl", "xl", "2xl"]}
      ml="5"
      verticalAlign={["2%", "2%", "8%"]}
    >
      Developer Preview
    </Box>
  </Heading>
);
