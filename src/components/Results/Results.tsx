import { FunctionComponent, memo } from "react";
import { Packages } from "../../api/package/packages";
import { Language } from "../../constants/languages";
import { CatalogCard } from "../CatalogCard";
import { ResultsGrid } from "./ResultsGrid";

export interface ResultsProps {
  language?: Language;
  results: Packages["packages"];
  skeleton?: {
    loading: boolean;
    noOfItems: number;
  };
}

const ResultsComponent: FunctionComponent<ResultsProps> = ({
  language,
  results,
}) => {
  return (
    <ResultsGrid>
      {results.map((pkg, idx) => (
        <CatalogCard key={`${pkg.name}-${idx}`} language={language} pkg={pkg} />
      ))}
    </ResultsGrid>
  );
};

export const Results = memo(ResultsComponent) as typeof ResultsComponent;
