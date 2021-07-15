import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export const Title: FunctionComponent = () => (
  <Link to="/">
    <Heading as="h1" color="blue.800" size="lg">
      <Box as="span" color="blue.500">
        Construct
      </Box>
      {/* Zero-width space - separates the word for screen-readers only */}
      <wbr />
      Hub
    </Heading>
  </Link>
);
