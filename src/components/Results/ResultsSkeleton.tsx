import { FunctionComponent, memo } from "react";
import { CatalogCard } from "../CatalogCard";
import { ResultsGrid } from "./ResultsGrid";

export interface ResultsSkeletonProps {
  noOfItems: number;
}

const ResultsSkeletonComponent: FunctionComponent<ResultsSkeletonProps> = ({
  noOfItems,
}) => {
  const skeletons = [];

  const skeleton = <CatalogCard />;

  for (let i = 0; i < noOfItems; i += 1) {
    skeletons.push(skeleton);
  }

  return <ResultsGrid>{skeletons}</ResultsGrid>;
};

export const ResultsSkeleton = memo(
  ResultsSkeletonComponent
) as typeof ResultsSkeletonComponent;
