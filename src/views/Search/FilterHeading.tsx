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
import { eventName } from "../../contexts/Analytics";
import { SEARCH_ANALYTICS } from "./constants";

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
      <Heading as="h3" size="sm" w="max-content">
        {name}
      </Heading>
      {hint ? (
        <Popover colorScheme="dark" placement={placement} strategy="fixed">
          <PopoverTrigger>
            <Flex
              aria-label={`Hint: ${name}`}
              as="button"
              data-event={eventName(SEARCH_ANALYTICS.FILTERS, name, "Popover")}
              ml={2}
            >
              <QuestionIcon h={3.5} w={3.5} />
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            bg="gray.700"
            borderRadius="base"
            color="white"
            fontSize="sm"
            mx={{ base: "1rem", md: "initial" }}
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
