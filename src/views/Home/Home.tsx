import { Box, Stack, Heading, Image } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Results } from "../../components/Results";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";

export const Home: FunctionComponent = () => {
  const searchAPI = useCatalogSearch();

  const { displayable, loading } = useCatalogResults({
    offset: 0,
    limit: 20,
    query: "",
    language: null,
  });

  return (
    <>
      <Box as="picture" position="absolute" top="0" w="100%" zIndex="hide">
        <source media="(max-width:1024px)" srcSet="hive@50.webp" />
        <source media="(min-width:1024px" srcSet="hive@100.webp" />
        <source media="(min-width:1024px)" srcSet="hive@100.png" />
        <Image alt="" h="540px" src="hive@50.png" w="100%" />
      </Box>
      {/* Hero Section */}
      <Stack
        align="stretch"
        direction="column"
        justify="center"
        m="0 auto"
        maxW="container.lg"
        p={[10, 15, 20]}
        spacing={8}
      >
        <Heading color="blue.800" size="2xl" textAlign="center">
          A catalog of AWS Cloud Development kit construct libraries
        </Heading>
        <CatalogSearch {...searchAPI} />
      </Stack>

      {/* TBD: Trending Libraries in favor of catalog results */}
      <Box p={4}>
        <Results results={displayable} skeleton={{ loading, noOfItems: 20 }} />
      </Box>
    </>
  );
};
