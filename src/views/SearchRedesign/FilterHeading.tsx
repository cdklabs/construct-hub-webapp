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
    <Flex align="center">
      <Heading as="h4" size="sm" w="max-content">
        {name}
      </Heading>
      {hint ? (
        <Popover colorScheme="dark" placement="top-end" strategy="fixed">
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
          <PopoverContent
            bg="gray.700"
            color="white"
            fontSize="sm"
            shadow="whiteAlpha.300"
          >
            <PopoverHeader>Hint: {name}</PopoverHeader>
            <PopoverCloseButton />
            <PopoverArrow />
            <PopoverBody>
              <Text>{hint}</Text>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : null}
    </Flex>
  );
};
