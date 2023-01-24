import { Box, Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import type { RendererProps } from "./types";
import { CopyButton } from "../CopyButton";

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
            <Box
              as="span"
              key={key}
              // wordWrap is not supported as a style prop for some reason
              sx={{ wordWrap: "normal" }}
              {...getTokenProps({ token, key })}
            />
          ))}
        </div>
      ))}
    </Box>
  </>
);
