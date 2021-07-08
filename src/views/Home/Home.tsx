import { Box, Stack, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Picture } from "../../components/Picture";
import { Results } from "../../components/Results";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";

const sources = {
  optimal: [
    { media: "(max-width:1024px)", srcSet: "assets/hive@50.webp" },
    { media: "(min-width:1024px)", srcSet: "assets/hive@100.webp" },
    { media: "(min-width:1024px)", srcSet: "assets/hive@100.png" },
  ],
  fallback: "assets/hive@50.png",
};

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
      <Picture
        alt={""}
        h="540px"
        position="absolute"
        sources={sources.optimal}
        src={sources.fallback}
        top="0"
        w="100%"
        zIndex="hide"
      />
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
