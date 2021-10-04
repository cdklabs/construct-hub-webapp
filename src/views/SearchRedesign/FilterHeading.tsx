import { QuestionIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
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
import { FunctionComponent } from "react";

export interface FilterHeadingProps {
  name: string;
  hint?: string;
}

export const FilterHeading: FunctionComponent<FilterHeadingProps> = ({
  name,
  hint,
}) => {
  return (
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
  );
};
