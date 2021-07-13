import { Box, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Blockquote: FunctionComponent = ({ children }) => (
  <Box
    as="blockquote"
    bg="gray.100"
    borderLeft="5px solid"
    borderLeftColor="gray.200"
    borderRadius="md"
    p={2}
    wordBreak="break-all"
  >
    {children}
  </Box>
);

export const Em: FunctionComponent = ({ children }) => (
  <Box as="em" color="blue.500" fontStyle="normal" fontWeight="semibold">
    {children}
  </Box>
);

export const P: FunctionComponent = ({ children }) => <Text>{children}</Text>;

export const Pre: FunctionComponent = ({ children }) => (
  <Box as="pre">{children}</Box>
);

export const Sup: FunctionComponent = ({ children }) => {
  let color: string | undefined = undefined;
  let text = "";

  if (Array.isArray(children)) {
    const [first] = children;

    if (typeof first === "string") {
      text = first;
    }
  }

  if (text === "Required") {
    color = "orange.500";
  } else if (text === "Optional") {
    color = "green.500";
  }

  return (
    <Box as="sup" color={color} ml={2} top={-1}>
      {children}
    </Box>
  );
};
