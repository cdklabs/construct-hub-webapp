import { FunctionComponent, memo } from "react";
import { Packages } from "../../api/package/packages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { CatalogCard } from "../CatalogCard";
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
      {results.map((pkg) => (
        <CatalogCard
          key={pkg.name}
          pkg={pkg}
          url={`/packages/${pkg.name}/v/${pkg.version}?${QUERY_PARAMS.LANGUAGE}=${language}`}
        />
      ))}
    </ResultsGrid>
  );
};

export const Results = memo(ResultsComponent) as typeof ResultsComponent;
