import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";
import testIds from "./testIds";

export interface RadioFilterProps extends FilterHeadingProps {
  "data-testid"?: string;
  value?: string;
  onValueChange: (value: string) => void;
  options: {
    display: string;
    value: string;
  }[];
}

export const RadioFilter: FunctionComponent<RadioFilterProps> = ({
  "data-testid": dataTestid,
  value: checkedValue,
  onValueChange,
  options,
  name,
  hint,
}) => {
  return (
    <Stack data-testid={dataTestid} spacing={2}>
      <FilterHeading hint={hint} name={name} />
      <RadioGroup onChange={onValueChange} value={checkedValue}>
        <Stack>
          {options.map(({ display, value }) => (
            <Radio key={value} value={value}>
              <Text
                color="gray.600"
                data-testid={testIds.filterItem}
                data-value={value}
                fontSize="sm"
                isTruncated
              >
                {display}
              </Text>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Stack>
  );
};
