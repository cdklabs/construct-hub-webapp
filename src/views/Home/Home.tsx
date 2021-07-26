import { Box, Stack, Heading, Skeleton } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { CatalogSearch } from "../../components/CatalogSearch";
import { Picture } from "../../components/Picture";
import { Results } from "../../components/Results";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { HomePageControls } from "./HomePageControls";

const sources = {
  optimal: [
    { media: "(max-width:1024px)", srcSet: "/assets/hive@50.webp" },
    { media: "(min-width:1024px)", srcSet: "/assets/hive@100.webp" },
    { media: "(min-width:1024px)", srcSet: "/assets/hive@100.png" },
  ],
  fallback: "/assets/hive@50.png",
};

export const Home: FunctionComponent = () => {
  const searchAPI = useCatalogSearch();
  const [offset, setOffset] = useState(0);

  const { results, displayable, loading, pageLimit } = useCatalogResults({
    offset,
    limit: 20,
    query: "",
    language: null,
  });

  return (
    <>
      <Picture
        alt={""}
        h="540px"
        opacity={0.5}
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
        <Stack color="blue.800" spacing={4} textAlign="center">
          <Heading size="2xl">
            Find reusable components for your cloud applications
          </Heading>
          <Heading as="h3" size="md">
            AWS CDK | CDK for Terraform | CDK For Kubernetes
          </Heading>
          <Heading as="h4" mb={8} size="sm">
            Search from{" "}
            {!results.length ? (
              <Skeleton display="inline-block" h={3} w={8} />
            ) : (
              <Box as="span" color="blue.500">
                {results.length}
              </Box>
            )}{" "}
            Constructs
          </Heading>
        </Stack>
        <CatalogSearch {...searchAPI} />
      </Stack>

      {/* TBD: Trending Libraries in favor of catalog results */}
      <Box p={4} pb={8}>
        <Results results={displayable} skeleton={{ loading, noOfItems: 20 }} />
        <HomePageControls
          offset={offset}
          pageLimit={pageLimit}
          setOffset={setOffset}
        />
      </Box>
    </>
  );
};
