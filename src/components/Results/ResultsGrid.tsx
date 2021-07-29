import { SimpleGrid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const ResultsGrid: FunctionComponent = ({ children }) => (
  <SimpleGrid
    columns={{
      base: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      "2xl": 6,
    }}
    spacing={6}
  >
    {children}
  </SimpleGrid>
);
