import { Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { eventName } from "../../contexts/Analytics";
import { SEARCH_ANALYTICS } from "./constants";
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
    <Stack data-testid={dataTestid} spacing={1}>
      <FilterHeading hint={hint} name={name} />
      <RadioGroup onChange={onValueChange} value={checkedValue}>
        <Stack spacing={1}>
          {options.map(({ display, value }) => {
            const dataEvent = eventName(
              SEARCH_ANALYTICS.FILTERS,
              name,
              "Filter",
              display
            );
            return (
              <Radio data-event={dataEvent} key={value} value={value}>
                <Text
                  color="gray.600"
                  data-event={dataEvent}
                  data-testid={testIds.filterItem}
                  data-value={value}
                  isTruncated
                >
                  {display}
                </Text>
              </Radio>
            );
          })}
        </Stack>
      </RadioGroup>
    </Stack>
  );
};
