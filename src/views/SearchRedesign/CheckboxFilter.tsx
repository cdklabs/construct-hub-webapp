import { Checkbox, Stack, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";
import testIds from "./testIds";

export interface CheckboxFilterProps extends FilterHeadingProps {
  "data-testid"?: string;
  options: {
    display: string;
    value: string;
  }[];
  values: string[];
  onValueChange: (value: string) => void;
}

export const CheckboxFilter: FunctionComponent<CheckboxFilterProps> = ({
  "data-testid": dataTestid,
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
    <Stack data-testid={dataTestid} spacing={2}>
      <FilterHeading hint={hint} name={name} />
      {options.map(({ display, value }) => (
        <Checkbox
          isChecked={checkedValues.includes(value)}
          key={value}
          onChange={getOnChange(value)}
        >
          <Text
            color="gray.600"
            data-testid={testIds.filterItem}
            data-value={value}
            fontSize="sm"
            isTruncated
          >
            {display}
          </Text>
        </Checkbox>
      ))}
    </Stack>
  );
};
