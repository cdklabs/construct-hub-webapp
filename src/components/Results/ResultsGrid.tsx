import { SimpleGrid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const ResultsGrid: FunctionComponent = ({ children }) => (
  <SimpleGrid columns={{ base: 1, md: 3, xl: 5 }} spacing={6}>
    {children}
  </SimpleGrid>
);
