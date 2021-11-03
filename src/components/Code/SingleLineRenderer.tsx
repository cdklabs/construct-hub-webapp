import { Box, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CopyButton } from "../CopyButton";
import type { RendererProps } from "./types";

export const SingleLineRenderer: FunctionComponent<RendererProps> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <Grid p={2} templateColumns="1fr min-content" w="full">
    <Box maxW="full" overflow="auto">
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line, key: i })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token, key })} />
          ))}
        </div>
      ))}
    </Box>
    <Box borderLeft="base" ml={1}>
      <CopyButton
        color="blue.500"
        colorScheme="blue"
        ml={1}
        value={code}
        variant="ghost"
      />
    </Box>
  </Grid>
);
