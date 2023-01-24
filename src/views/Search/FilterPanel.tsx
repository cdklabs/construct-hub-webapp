import { Heading, Stack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CDKFilter } from "./CDKFilter";
import { KeywordsFilter } from "./KeywordsFilter";
import { LanguageFilter } from "./LanguageFilter";
import { TagFilter } from "./TagFilter";
import testIds from "./testIds";
import { Card } from "../../components/Card";

export interface FilterPanelProps {}

// Header height + section padding
const TOP_OFFSET = "5.75rem";

/**
 * The desktop Resolution Filter Panel
 */
export const FilterPanel: FunctionComponent<FilterPanelProps> = () => {
  return (
    <Card
      borderRadius="sm"
      data-testid={testIds.filtersPanel}
      display={{ base: "none", md: "flex" }}
      maxH={`calc(100vh - ${TOP_OFFSET} - 1.25rem)`}
      maxW="23rem"
      minW="100%"
      overflow="hidden auto"
      p={4}
      pos="sticky"
      top={TOP_OFFSET}
      zIndex="docked"
    >
      <Stack color="textPrimary" h="max-content" spacing={4} top={4}>
        <Heading as="h2" size="sm">
          Filters
        </Heading>

        <CDKFilter />

        <LanguageFilter />

        <TagFilter />

        <KeywordsFilter />
      </Stack>
    </Card>
  );
};
