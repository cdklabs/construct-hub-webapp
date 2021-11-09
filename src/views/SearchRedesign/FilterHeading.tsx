import { QuestionIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Text,
  Popover,
  // IconButton,
  PopoverTrigger,
  PopoverBody,
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
    <Flex align="center" mb={1}>
      <Heading as="h4" size="sm" w="max-content">
        {name}
      </Heading>
      {hint ? (
        <Popover colorScheme="dark" placement="right" strategy="fixed">
          <PopoverTrigger>
            <Flex aria-label={`Hint: ${name}`} as="button" ml={2}>
              <QuestionIcon h={3.5} w={3.5} />
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            bg="gray.700"
            borderRadius="base"
            color="white"
            fontSize="sm"
            shadow="whiteAlpha.300"
          >
            <PopoverArrow bg="gray.700" />
            <PopoverBody>
              <Text>{hint}</Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : null}
    </Flex>
  );
};
