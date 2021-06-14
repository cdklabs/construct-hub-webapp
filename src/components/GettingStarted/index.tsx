import { Box, Flex, Text, Divider } from "@chakra-ui/react";
import { Language, LANGUAGES } from "../../constants/languages";
import { NavLink } from "../NavLink";
import { ClientLibraries } from "./ClientLibraries";
import { DisabledLangPopover } from "./DisabledLangPopover";

export interface GettingStartedProps {
  targets: Language[];
}

export function GettingStarted({ targets }: GettingStartedProps) {
  return (
    <Box justifySelf="center">
      <Flex
        bg="white"
        borderRadius="md"
        boxShadow="base"
        direction="column"
        p={2}
        pb={0}
      >
        <Flex align="center" justify="space-between">
          <Flex direction="column">
            <Text
              color="gray.700"
              fontSize="md"
              fontWeight="bold"
              textTransform="uppercase"
            >
              Just getting started?
            </Text>
            {/* Don't know where this link will point to yet */}
            <Text my={2}>
              Check out our{" "}
              <NavLink color="blue.500" to="#">
                development quickstart
              </NavLink>{" "}
              guide.
            </Text>
          </Flex>
          {targets.length < LANGUAGES.length ? <DisabledLangPopover /> : null}
        </Flex>
        <Divider />
        {/* LanguageBar card */}
        <ClientLibraries targets={targets} />
      </Flex>
    </Box>
  );
}
