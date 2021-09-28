import { Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export interface FilterProps {
  name: string;
  options: {
    display: string;
    value: string;
  }[];
  values: string[];
  onValueChange: (value: string) => void;
}

export const Filter: FunctionComponent<FilterProps> = ({
  name,
  options,
  values: checkedValues,
  onValueChange,
}) => {
  const getOnChange = (value: string) => () => {
    onValueChange(value);
  };

  return (
    <Stack spacing={2}>
      <Heading as="h4" size="sm">
        {name}
      </Heading>
      {options.map(({ display, value }) => (
        <Checkbox
          isChecked={checkedValues.includes(value)}
          key={value}
          onChange={getOnChange(value)}
        >
          <Text color="gray.600" fontSize="sm" isTruncated>
            {display}
          </Text>
        </Checkbox>
      ))}
    </Stack>
  );
};
