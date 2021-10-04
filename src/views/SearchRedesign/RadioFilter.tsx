import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";

export interface RadioFilterProps extends FilterHeadingProps {
  value?: string;
  onValueChange: (value: string) => void;
  options: {
    display: string;
    value: string;
  }[];
}

export const RadioFilter: FunctionComponent<RadioFilterProps> = ({
  value: checkedValue,
  onValueChange,
  options,
  name,
  hint,
}) => {
  return (
    <Stack spacing={2}>
      <FilterHeading hint={hint} name={name} />
      <RadioGroup onChange={onValueChange} value={checkedValue}>
        <Stack>
          {options.map(({ display, value }) => (
            <Radio key={value} value={value}>
              {display}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Stack>
  );
};
