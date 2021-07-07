import { Flex, Stack, Skeleton } from "@chakra-ui/react";
import { FunctionComponent, memo } from "react";
import { ResultsCard } from "./ResultsCard";
import { ResultsGrid } from "./ResultsGrid";

export interface ResultsSkeletonProps {
  noOfItems: number;
}

const ResultsSkeletonComponent: FunctionComponent<ResultsSkeletonProps> = ({
  noOfItems,
}) => {
  const skeletons = [];

  const skeleton = (
    <ResultsCard>
      <Flex direction="column" h="100%" justify="space-between">
        <Stack direction="column" mt={4} spacing={6}>
          {/* Name & version */}
          <Skeleton h={4} />
          <Skeleton h={4} w="40px" />
          {/* Description Section */}
          <Stack direction="column">
            <Skeleton h={3} />
            <Skeleton h={3} />
          </Stack>
          <Stack direction="column">
            <Skeleton h={3} />
            <Skeleton h={3} />
          </Stack>
        </Stack>
        {/* Tags */}
        <Flex>
          <Skeleton h={5} mr="1" w="40px" />
          <Skeleton h={5} mr="1" w="40px" />
          <Skeleton h={5} w="40px" />
        </Flex>
      </Flex>
    </ResultsCard>
  );

  for (let i = 0; i < noOfItems; i += 1) {
    skeletons.push(skeleton);
  }

  return <ResultsGrid>{skeletons}</ResultsGrid>;
};

export const ResultsSkeleton = memo(
  ResultsSkeletonComponent
) as typeof ResultsSkeletonComponent;
