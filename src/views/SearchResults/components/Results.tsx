import { Box, Flex, GridItem, SimpleGrid, Tag, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Packages } from "../../../api/package/packages";
import { Card } from "../../../components/Card";

export interface ResultsProps {
  results: Packages["packages"];
}

export const Results: FunctionComponent<ResultsProps> = ({ results }) => {
  return (
    <SimpleGrid columns={[1, null, 3, null, 5]} mt={4} spacing={6}>
      {results.map((pkg) => {
        return (
          <Link
            key={`${pkg.name}@${pkg.version}`}
            to={`/packages/${pkg.name}/v/${pkg.version}`}
          >
            <Card as={GridItem} colSpan={1} h={64} w="100%">
              <Flex
                direction="column"
                height="100%"
                justifyContent="space-between"
                p={2}
              >
                <Text>{pkg.name}</Text>
                <Text>{pkg.version}</Text>
                <Text>{pkg.metadata.description}</Text>
                <Text>
                  {`Published on ${format(
                    new Date(pkg.metadata.date),
                    "MMMM dd, yyyy"
                  )} by ${pkg.metadata.author.name}`}
                </Text>
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
            </Card>
          </Link>
        );
      })}
    </SimpleGrid>
  );
};
