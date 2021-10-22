import { Box, Flex, Heading } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  SearchBar,
  SearchOverlay,
  SearchSuggestions,
} from "../../components/SearchBar";
import { SECTION_PADDING } from "./constants";
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
        Build cloud infrastructure with reusable components
      </Heading>
      <Heading
        as="h2"
        data-testid={testIds.heroSubtitle}
        fontWeight="normal"
        mt={4}
        size="md"
      >
        Open source registry for AWS CDK, CDKtf and CDK8s
      </Heading>
      <Box color="initial" maxW="36rem" mt={8} mx="auto" w="full">
        <SearchBar hasButton>
          <SearchOverlay />
          <SearchSuggestions />
        </SearchBar>
      </Box>
    </Flex>
  );
};
