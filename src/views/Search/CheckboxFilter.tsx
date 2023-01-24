import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Button,
  Collapse,
  Checkbox,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { SEARCH_ANALYTICS } from "./constants";
import { FilterHeading, FilterHeadingProps } from "./FilterHeading";
import testIds from "./testIds";
import { clickEvent, eventName, useAnalytics } from "../../contexts/Analytics";

interface CheckboxOption {
  display: string;
  value: string;
  isDisabled?: boolean;
  disabledHint?: string;
}

interface CheckboxItemProps extends CheckboxOption {
  onChange: () => void;
  isChecked: boolean;
}

export interface CheckboxFilterProps extends FilterHeadingProps {
  /**
   * Test ID to select checkbox in tests
   */
  "data-testid"?: string;
  /**
   * Number of items that can be initially shown
   */
  initialItemCount?: number;
  /**
   * Defines checkbox items
   */
  options: CheckboxOption[];
  /**
   * Selected values
   */
  values: string[];
  /**
   * Callback triggered when an item is clicked
   */
  onValueChange: (value: string) => void;
}

const CheckboxItem: FunctionComponent<CheckboxItemProps> = ({
  display,
  value,
  isDisabled,
  disabledHint,
  isChecked,
  onChange,
}) => (
  <Checkbox
    isChecked={isChecked}
    isDisabled={isDisabled}
    key={value}
    onChange={onChange}
  >
    <Tooltip
      hasArrow
      isDisabled={!isDisabled && !disabledHint}
      label={disabledHint}
      placement="right"
    >
      <Text
        color="textTertiary"
        data-testid={testIds.filterItem}
        data-value={value}
        isTruncated
      >
        {display}
      </Text>
    </Tooltip>
  </Checkbox>
);

export const CheckboxFilter: FunctionComponent<CheckboxFilterProps> = ({
  "data-testid": dataTestid,
  initialItemCount,
  hint,
  name,
  options,
  values: checkedValues,
  onValueChange,
}) => {
  const collapse = useDisclosure();
  const { trackCustomEvent } = useAnalytics();

  const getOnChange = (item: CheckboxOption) => () => {
    trackCustomEvent(
      clickEvent({
        name: eventName(SEARCH_ANALYTICS.FILTERS, name, "Filter", item.display),
      })
    );
    onValueChange(item.value);
  };

  let alwaysShow: typeof options = options;
  let showWhenExpanded: typeof options = [];

  if (initialItemCount) {
    alwaysShow = options.slice(0, initialItemCount);
    showWhenExpanded = options.slice(initialItemCount, options.length);
  }

  const isExpandible = showWhenExpanded.length > 0;

  return (
    <Flex data-testid={dataTestid} direction="column">
      <FilterHeading hint={hint} name={name} />
      <Stack mt={1} spacing={1}>
        {alwaysShow.map((item) => (
          <CheckboxItem
            {...item}
            isChecked={checkedValues.includes(item.value)}
            key={item.value}
            onChange={getOnChange(item)}
          />
        ))}
        {isExpandible && (
          <Collapse animateOpacity in={collapse.isOpen} unmountOnExit>
            <Stack spacing={1}>
              {showWhenExpanded.map((item) => (
                <CheckboxItem
                  {...item}
                  isChecked={checkedValues.includes(item.value)}
                  key={item.value}
                  onChange={getOnChange(item)}
                />
              ))}
            </Stack>
          </Collapse>
        )}
      </Stack>
      {isExpandible && (
        <Flex align="start" mt={1}>
          <Button
            color="textTertiary"
            data-event={eventName(SEARCH_ANALYTICS.FILTERS, name, "Show More")}
            fontWeight="normal"
            leftIcon={collapse.isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={collapse.onToggle}
            size="sm"
            textAlign="left"
            variant="link"
            w="auto"
          >
            {collapse.isOpen
              ? `Show fewer options (${alwaysShow.length})`
              : `Show more options (${showWhenExpanded.length})`}
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
