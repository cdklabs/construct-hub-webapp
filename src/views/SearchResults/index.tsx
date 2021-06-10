import { Box, SimpleGrid, Flex, GridItem, Tag, Text } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { fetchPackages } from "../../api/package/packages";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest } from "../../hooks/useRequest";

export function SearchResults() {
  const query = useQueryParams().get("q") ?? "";
  const [requestPackages, { data }] = useRequest(fetchPackages);

  useEffect(() => {
    void requestPackages();
  }, [requestPackages]);

  const results = useMemo(() => {
    return query.length
      ? data?.packages.filter((item) => JSON.stringify(item).includes(query))
      : data?.packages ?? [];
  }, [query, data]);

  return (
    <SimpleGrid columns={[1, null, 3, null, 5]} p={6} spacing={6}>
      {results &&
        results.map((pkg) => {
          return (
            <Link key={pkg.name} to={`/packages/${pkg.name}/v/${pkg.version}`}>
              <GridItem
                border="1px solid"
                borderColor="gray.300"
                borderRadius="md"
                boxShadow="md"
                colSpan={1}
                h={64}
                w="100%"
              >
                <Flex
                  direction="column"
                  height="100%"
                  justifyContent="space-between"
                  p={2}
                >
                  <Text>{pkg.name}</Text>
                  <Box overflow="hidden">
                    {pkg.metadata.keywords.map((tag) => {
                      return (
                        <Tag key={tag} mr={1}>
                          {tag}
                        </Tag>
                      );
                    })}
                  </Box>
                </Flex>
              </GridItem>
            </Link>
          );
        })}
    </SimpleGrid>
  );
}
