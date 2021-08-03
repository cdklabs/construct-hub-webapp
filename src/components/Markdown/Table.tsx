import {
  Box,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tfoot,
  Tr as ChakraTr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

const Tr: FunctionComponent = ({ children, ...props }) => (
  <ChakraTr {...props}>{children}</ChakraTr>
);

const Table: FunctionComponent = ({ children }) => (
  <Box maxW="100%" overflowX="auto">
    <ChakraTable variant="striped" w="min">
      {children}
    </ChakraTable>
  </Box>
);

export { Table, Tfoot, Tbody, Td, Thead, Tr, Th, TableCaption };
