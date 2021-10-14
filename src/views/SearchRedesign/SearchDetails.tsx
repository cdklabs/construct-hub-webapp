import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

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

export const SearchDetails: FunctionComponent<SearchDetailsProps> = ({
  limit,
  offset,
  count,
  filtered,
  query,
}) => {
  const first = limit * offset;
  const last = first + limit;
  return (
    <Text>
      Displaying{" "}
      <Em>
        {count ? first + 1 : count} - {last > count ? count : last}
      </Em>{" "}
      of <Em>{count}</Em> {filtered ? "search results" : "constructs"}
      {query && (
        <>
          {" for "}
          <Em>{query}</Em>
        </>
      )}
    </Text>
  );
};
