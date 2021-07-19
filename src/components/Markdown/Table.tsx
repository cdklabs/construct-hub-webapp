import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

export const Table: FunctionComponent = ({ children }) => (
  <ChakraTable variant="striped">{children}</ChakraTable>
);

export { Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption };
