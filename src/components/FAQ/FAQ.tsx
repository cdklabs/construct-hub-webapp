import { Box } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const FAQ: FunctionComponent = ({ children }) => (
  <Box bg="white" color="blue.800" h="100%" w="100%">
    {children}
    <Box py={5} width="100%" />
  </Box>
);
