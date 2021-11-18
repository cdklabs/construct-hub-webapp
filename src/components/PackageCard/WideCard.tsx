import { Flex, Grid, LinkBox, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Details } from "./Details";
import { Heading } from "./Heading";
import { Highlight } from "./Highlight";
import { Languages } from "./Languages";
import { Tags } from "./Tags";
import testIds from "./testIds";

export const WideCard: FunctionComponent = () => {
  return (
    <LinkBox
      _hover={{
        "> article": {
          bg: "gray.50",
        },
      }}
    >
      <Grid
        as="article"
        bg="white"
        border="base"
        borderRadius="sm"
        boxShadow="base"
        color="blue.800"
        data-testid={testIds.wideContainer}
        h="full"
        minH="12.5rem"
        templateColumns={{ base: "1fr", lg: "1fr 12rem" }}
        w="full"
      >
        {/* Top / Left side of card */}
        <Flex
          direction="column"
          justify="space-between"
          p={5}
          sx={{ gap: "0.5rem" }}
        >
          <Stack spacing={3}>
            <Heading />
          </Stack>

          <Flex align="center" sx={{ gap: "0.5rem" }} wrap="wrap">
            <Tags />
          </Flex>
        </Flex>

        {/* Bottom / Right side of card */}
        <Flex
          align={{ base: "end", lg: "initial" }}
          borderLeft={{ lg: "base" }}
          borderTop={{ base: "base", lg: "none" }}
          direction={{ base: "row", lg: "column" }}
          justify="space-between"
          p={5}
          sx={{ gap: "0.5rem" }}
        >
          <Stack spacing={1}>
            <Highlight />
            <Stack spacing={1}>
              <Details />
            </Stack>
          </Stack>

          <Stack data-testid={testIds.languages} direction="row" spacing={2}>
            <Languages />
          </Stack>
        </Flex>
      </Grid>
    </LinkBox>
  );
};
