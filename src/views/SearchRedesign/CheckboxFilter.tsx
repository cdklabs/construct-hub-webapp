import { Checkbox, Stack, Text, Tooltip } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";
import testIds from "./testIds";

export interface CheckboxFilterProps extends FilterHeadingProps {
  "data-testid"?: string;
  options: {
    display: string;
    value: string;
    isDisabled?: boolean;
    disabledHint?: string;
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
      {options.map(({ disabledHint, display, isDisabled, value }) => (
        <Checkbox
          isChecked={checkedValues.includes(value)}
          isDisabled={isDisabled}
          key={value}
          onChange={getOnChange(value)}
        >
          <Tooltip
            hasArrow
            isDisabled={!isDisabled && !disabledHint}
            label={disabledHint}
            placement="right"
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
          </Tooltip>
        </Checkbox>
      ))}
    </Stack>
  );
};
