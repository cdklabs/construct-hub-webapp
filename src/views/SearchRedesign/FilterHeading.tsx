import { QuestionIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  Text,
  Popover,
  PopoverTrigger,
  PopoverBody,
  PopoverArrow,
  PopoverContent,
  useBreakpointValue,
  PlacementWithLogical,
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
  const placement = useBreakpointValue<PlacementWithLogical>({
    base: "auto",
    md: "right",
  });

  return (
    <Flex align="center" mb={1}>
      <Heading as="h4" size="sm" w="max-content">
        {name}
      </Heading>
      {hint ? (
        <Popover colorScheme="dark" placement={placement} strategy="fixed">
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
            mx={{ base: "1rem", md: "initial" }}
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
