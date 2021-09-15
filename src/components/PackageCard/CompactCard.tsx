import { Flex, Stack, LinkBox, Divider } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Details } from "./Details";
import { Heading } from "./Heading";
import { Languages } from "./Languages";

export const CompactCard: FunctionComponent = () => {
  return (
    <LinkBox
      _hover={{
        "> article": {
          bg: "gray.50",
        },
      }}
    >
      <Stack
        as="article"
        bg="white"
        border="base"
        borderRadius="sm"
        color="gray.600"
        h="100%"
        maxW="100%"
        minW="320px"
        p={5}
        spacing={5}
      >
        <Stack flex={1} spacing={2}>
          <Heading />
        </Stack>

        <Divider bg="blue.50" />

        <Flex
          align="center"
          direction="row"
          justify="space-between"
          spacing={5}
        >
          <Stack direction="row" spacing={2}>
            <Languages />
          </Stack>

          <Stack spacing={1}>
            <Details />
          </Stack>
        </Flex>
      </Stack>
    </LinkBox>
  );
};
