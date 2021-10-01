import { Heading, Stack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Card } from "../../components/Card";
import { AuthorFilter } from "./AuthorFilter";
import { CDKFilter } from "./CDKFilter";
import { LanguageFilter } from "./LanguageFilter";

export interface FilterPanelProps {}

export const FilterPanel: FunctionComponent<FilterPanelProps> = () => {
  return (
    <Card
      borderRadius="none"
      boxShadow="none"
      maxH="full"
      maxW="368px"
      minW="100%"
      ml={6}
      overflow="hidden auto"
      p={4}
    >
      <Stack color="blue.800" spacing={6}>
        <Heading as="h3" size="sm">
          Filters
        </Heading>
        <CDKFilter />
        <LanguageFilter />
        <AuthorFilter />
      </Stack>
    </Card>
  );
};
