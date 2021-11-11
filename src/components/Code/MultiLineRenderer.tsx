import { Box, Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CopyButton } from "../CopyButton";
import type { RendererProps } from "./types";

export const MultiLineRenderer: FunctionComponent<RendererProps> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <>
    <Flex
      align="center"
      bg="rgba(0, 124, 253, 0.15)"
      borderTopRadius="md"
      justify="flex-end"
      px={2}
      py={1}
    >
      <CopyButton value={code} />
    </Flex>
    <Box overflowX="auto" p={2}>
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line, key: i })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token, key })} />
          ))}
        </div>
      ))}
    </Box>
  </>
);
