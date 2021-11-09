import { Box, Flex, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { CopyButton } from "../CopyButton";
import type { RendererProps } from "./types";

export const SingleLineRenderer: FunctionComponent<RendererProps> = ({
  code,
  tokens,
  getLineProps,
  getTokenProps,
}) => (
  <Grid marginTop={5} p={3} templateColumns="1fr min-content" w="full">
    <Box m={-3} maxW="full" overflow="auto" p={3}>
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line, key: i })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token, key })} />
          ))}
        </div>
      ))}
    </Box>
    <Flex align="center" borderLeft="base" ml={1}>
      <CopyButton
        color="blue.500"
        colorScheme="blue"
        ml={1}
        value={code}
        variant="ghost"
      />
    </Flex>
  </Grid>
);
