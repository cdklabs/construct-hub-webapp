import { Grid, Stack, LinkBox } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Details } from "./Details";
import { Heading } from "./Heading";
import { Languages } from "./Languages";
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
        color="gray.600"
        data-testid={testIds.wideContainer}
        gap={5}
        p={5}
        templateColumns={{ base: "1fr", md: "2fr 1fr" }}
        templateRows={{ base: "auto", md: "1fr" }}
        w="100%"
      >
        {/* Name + Desc */}
        <Stack spacing={2}>
          <Heading />

          <Stack direction="row" spacing={1}>
            <Languages />
          </Stack>
        </Stack>

        <Stack
          alignSelf="center"
          data-testid={testIds.languages}
          fontSize="xs"
          spacing={1}
        >
          <Details />
        </Stack>
      </Grid>
    </LinkBox>
  );
};
