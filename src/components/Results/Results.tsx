import { Box, Flex, Tag, Text } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import { Link } from "react-router-dom";
import { Packages } from "../../api/package/packages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { Time } from "../Time";
import { ResultsCard } from "./ResultsCard";
import { ResultsGrid } from "./ResultsGrid";
import { ResultsSkeleton } from "./ResultsSkeleton";

export interface ResultsProps {
  results: Packages["packages"];
  skeleton?: {
    loading: boolean;
    noOfItems: number;
  };
}

const ResultsComponent: FunctionComponent<ResultsProps> = ({
  results,
  skeleton,
}) => {
  const [language] = useLanguage();

  if (skeleton?.loading) {
    return <ResultsSkeleton noOfItems={skeleton.noOfItems} />;
  }

  return (
    <ResultsGrid>
      {results.map((pkg) => {
        const publishDate = (
          <Time date={new Date(pkg.metadata.date)} format="MMMM dd, yyyy" />
        );
        return (
          <Link
            key={`${pkg.name}@${pkg.version}`}
            to={`/packages/${pkg.name}/v/${pkg.version}?${QUERY_PARAMS.LANGUAGE}=${language}`}
          >
            <ResultsCard>
              <Flex
                direction="column"
                height="100%"
                justifyContent="space-between"
                p={2}
              >
                <Text>{pkg.name}</Text>
                <Text>{pkg.version}</Text>
                <Text>{pkg.description}</Text>
                <Text>
                  <>
                    Published on {publishDate} by {pkg.author.name}
                  </>
                </Text>
                <Box overflow="hidden">
                  {pkg.keywords
                    .filter(Boolean)
                    .slice(0, 3)
                    .map((tag) => {
                      return (
                        <Tag key={tag} mr={1}>
                          {tag}
                        </Tag>
                      );
                    })}
                </Box>
              </Flex>
            </ResultsCard>
          </Link>
        );
      })}
    </ResultsGrid>
  );
};

export const Results = memo(ResultsComponent) as typeof ResultsComponent;
