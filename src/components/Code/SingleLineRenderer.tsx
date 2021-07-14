import { Box, Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CopyButton } from "../CopyButton";
import type { RendererProps } from "./types";

export const SingleLineRenderer: FunctionComponent<RendererProps> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <Flex align="center" justify="space-between" p={2}>
    {tokens.map((line, i) => (
      <div key={i} {...getLineProps({ line, key: i })}>
        {line.map((token, key) => (
          <span key={key} {...getTokenProps({ token, key })} />
        ))}
      </div>
    ))}
    <Box>
      <CopyButton color="blue.500" colorScheme="blue" ml={4} value={code} />
    </Box>
  </Flex>
);
