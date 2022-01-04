import { Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const DocsError: FunctionComponent = ({ children }) => (
  <Text
    align="center"
    fontSize="xl"
    fontStyle="oblique"
    px={4}
    wordBreak="break-word"
  >
    {children}
  </Text>
);
