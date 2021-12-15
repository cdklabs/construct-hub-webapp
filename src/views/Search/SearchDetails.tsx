import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useRecoilValue } from "recoil";
import { offsetState, queryState, resultsState } from "../../state/search";
import { LIMIT } from "./constants";
import testIds from "./testIds";

export interface SearchDetailsProps {
  limit: number;
  offset: number;
  count: number;
  filtered: boolean;
  query?: string;
}

const Em: FunctionComponent = ({ children }) => (
  <Text as="strong" color="gray.700">
    {children}
  </Text>
);

const Count: FunctionComponent<{
  first: number;
  count: number;
  last: number;
}> = ({ first, count, last }) => {
  if (!first && last >= count) {
    return (
      <>
        <Em>{count}</Em> of <Em>{count}</Em>
      </>
    );
  }

  return (
    <>
      <Em>
        {count ? first + 1 : count} - {last > count ? count : last}
      </Em>{" "}
      of <Em>{count}</Em>
    </>
  );
};

export const SearchDetails: FunctionComponent = () => {
  const offset = useRecoilValue(offsetState);
  const results = useRecoilValue(resultsState);
  const query = useRecoilValue(queryState);

  const isFiltered = Boolean(query);
  const count = results.length;
  const first = LIMIT * offset;
  const last = first + LIMIT;
  const hasResults = count > 0;

  return (
    <Text data-testid={testIds.searchDetails}>
      {hasResults ? (
        <>
          Displaying <Count count={count} first={first} last={last} />{" "}
          {isFiltered ? "search results" : "constructs"}
        </>
      ) : (
        <>
          {isFiltered ? "There were no search results" : "No constructs found"}
        </>
      )}
      {query && (
        <>
          {" for "}
          <Em>{query}</Em>
        </>
      )}
      .{!hasResults && isFiltered && <> Try a different term.</>}
    </Text>
  );
};
