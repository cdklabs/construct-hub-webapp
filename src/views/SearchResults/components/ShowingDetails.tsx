import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export interface ShowingDetailsProps {
  limit: number;
  offset: number;
  count: number;
  filtered: boolean;
}

const Em: FunctionComponent = ({ children }) => (
  <Text as="em" fontWeight="bold">
    {children}
  </Text>
);

export const ShowingDetails: FunctionComponent<ShowingDetailsProps> = ({
  limit,
  offset,
  count,
  filtered,
}) => {
  const first = limit * offset;
  const last = first + limit;
  return (
    <Text>
      Displaying{" "}
      <Em>
        {count ? first + 1 : count} - {last > count ? count : last}
      </Em>{" "}
      of <Em>{count}</Em> {filtered ? "search results" : "constructs"}.
    </Text>
  );
};
