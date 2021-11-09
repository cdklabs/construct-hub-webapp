import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
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

const Count: FunctionComponent<{ first: number; count: number; last: number }> =
  ({ first, count, last }) => {
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

export const SearchDetails: FunctionComponent<SearchDetailsProps> = ({
  limit,
  offset,
  count,
  filtered,
  query,
}) => {
  const first = limit * offset;
  const last = first + limit;
  const hasResults = count > 0;

  return (
    <Text data-testid={testIds.searchDetails}>
      {hasResults ? (
        <>
          Displaying <Count count={count} first={first} last={last} />{" "}
          {filtered ? "search results" : "constructs"}
        </>
      ) : (
        <>{filtered ? "There were no search results" : "No constructs found"}</>
      )}
      {query && (
        <>
          {" for "}
          <Em>{query}</Em>
        </>
      )}
      .{!hasResults && filtered && <> Try a different term.</>}
    </Text>
  );
};
