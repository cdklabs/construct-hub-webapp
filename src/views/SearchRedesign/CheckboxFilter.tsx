import { Checkbox, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";

export interface CheckboxFilterProps extends FilterHeadingProps {
  options: {
    display: string;
    value: string;
  }[];
  values: string[];
  onValueChange: (value: string) => void;
}

export const CheckboxFilter: FunctionComponent<CheckboxFilterProps> = ({
  hint,
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
      <FilterHeading hint={hint} name={name} />
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
