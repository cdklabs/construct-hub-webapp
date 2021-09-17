import { Checkbox, Heading, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export interface FilterProps {
  name: string;
  options: {
    display: string;
    value: string;
  }[];
  value: string | undefined;
  onValueChange: (value: string | undefined) => void;
}

export const Filter: FunctionComponent<FilterProps> = ({
  name,
  options,
  value: checkedValue,
  onValueChange,
}) => {
  const getOnChange = (v: string) => () => {
    onValueChange(v === checkedValue ? undefined : v);
  };

  return (
    <Stack spacing={2}>
      <Heading as="h4" size="sm">
        {name}
      </Heading>
      {options.map(({ display, value }) => (
        <Checkbox
          isChecked={value === checkedValue}
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
