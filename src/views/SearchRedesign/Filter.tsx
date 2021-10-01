import { QuestionIcon } from "@chakra-ui/icons";
import {
  Checkbox,
  Flex,
  Heading,
  Stack,
  Text,
  Popover,
  IconButton,
  PopoverHeader,
  PopoverTrigger,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverContent,
} from "@chakra-ui/react";
import type { FunctionComponent, ReactChild } from "react";

export interface FilterProps {
  hint?: ReactChild;
  name: string;
  options: {
    display: string;
    value: string;
  }[];
  values: string[];
  onValueChange: (value: string) => void;
}

export const Filter: FunctionComponent<FilterProps> = ({
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
      <Flex align="center" justify="space-between">
        <Heading as="h4" size="sm" w="max-content">
          {name}
        </Heading>
        {hint ? (
          <Popover placement="top-end">
            <PopoverTrigger>
              <IconButton
                aria-label={`Hint: ${name}`}
                icon={<QuestionIcon h={4} w={4} />}
                ml={2}
                px={0}
                py={0}
                size="sm"
                variant="ghost"
              />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Hint: {name}</PopoverHeader>
              <PopoverBody>
                <Text>{hint}</Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : null}
      </Flex>
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
