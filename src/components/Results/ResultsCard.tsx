import { GridItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Card } from "../Card";

export const ResultsCard: FunctionComponent = ({ children }) => (
  <Card as={GridItem} colSpan={1} h={64} w="100%">
    {children}
  </Card>
);
