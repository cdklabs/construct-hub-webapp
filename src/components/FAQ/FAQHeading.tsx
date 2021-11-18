import { Box, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const FAQHeading: FunctionComponent = ({ children }) => (
  <Box bg="gray.50" py={20} width="100%">
    <Heading as="h1" mx="auto" textAlign="center">
      {children}
    </Heading>
  </Box>
);
