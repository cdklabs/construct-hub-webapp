import { Box, Flex, Heading, Link, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  SearchBar,
  SearchOverlay,
  SearchSuggestions,
} from "../../components/SearchBar";

// All elements are currently static / have no real interactions
export const Hero: FunctionComponent = () => {
  return (
    <Flex
      align="center"
      bg="blue.800"
      color="white"
      direction="column"
      justify="center"
      py={12}
      zIndex="1"
    >
      <Heading as="h1" size="xl">
        Build cloud infrastructure with reusable components
      </Heading>
      <Heading as="h2" mt={2} size="lg">
        Provided by the{" "}
        <Box as="span" color="yellow.400">
          community
        </Box>
        , backed by{" "}
        <Box as="span" color="yellow.400">
          AWS
        </Box>
        .
      </Heading>
      <Flex direction="column" mt={8}>
        <Stack direction="row" spacing={7}>
          <Link borderBottom="1px solid" borderBottomColor="yellow.400">
            All CDKs
          </Link>
          <Link>AWS CDK</Link>
          <Link>CDK for Terraform</Link>
          <Link>CDK for Kubernetes</Link>
        </Stack>
        <Box color="initial" mt={4}>
          <SearchBar hasButton>
            <SearchOverlay />
            <SearchSuggestions />
          </SearchBar>
        </Box>
      </Flex>
    </Flex>
  );
};
