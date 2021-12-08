import { Box, Flex, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  SearchBar,
  SearchOverlay,
  SearchSuggestions,
} from "../../components/SearchBar";
import { HOME_ANALYTICS, SECTION_PADDING } from "./constants";
import testIds from "./testIds";

export const Hero: FunctionComponent = () => {
  return (
    <Flex
      align="center"
      color="white"
      direction="column"
      h="20rem"
      justify="center"
      px={SECTION_PADDING.X}
      py={SECTION_PADDING.Y}
      textAlign="center"
      zIndex="1"
    >
      <Heading as="h1" data-testid={testIds.heroHeader} size="xl">
        Simplify cloud development with constructs
      </Heading>
      <Heading
        as="h2"
        data-testid={testIds.heroSubtitle}
        fontWeight="normal"
        mt={4}
        size="md"
      >
        Find and use open-source Cloud Development Kit (CDK) libraries
      </Heading>
      <Box color="initial" maxW="36rem" mt={8} mx="auto" w="full">
        <SearchBar data-event={HOME_ANALYTICS.SEARCH} hasButton>
          <SearchOverlay />
          <SearchSuggestions />
        </SearchBar>
      </Box>
    </Flex>
  );
};
