import { SimpleGrid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const ResultsGrid: FunctionComponent = ({ children }) => (
  <SimpleGrid columns={[1, null, 3, null, 5]} spacing={6}>
    {children}
  </SimpleGrid>
);
