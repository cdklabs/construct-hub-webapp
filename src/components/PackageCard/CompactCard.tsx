import { Flex, Stack, LinkBox, Divider } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Details } from "./Details";
import { Heading } from "./Heading";
import { Languages } from "./Languages";

const CompactCard: FunctionComponent = () => {
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
        minW="320px"
        p={5}
        spacing={5}
        w="100%"
      >
        <Heading />

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

export default CompactCard;
