import { Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import testIds from "./testIds";

export const EditorsNote: FunctionComponent<{ comment?: string }> = ({
  comment,
}) => {
  return (
    <Text
      data-testid={testIds.comment}
      fontSize="md"
      lineHeight="tall"
      noOfLines={4}
    >
      <Text as="span" color="blue.500" fontWeight="bold">
        Editor&apos;s note:{" "}
      </Text>
      {comment}
    </Text>
  );
};
