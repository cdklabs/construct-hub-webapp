import { UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Ul: FunctionComponent = ({ children }) => (
  <UnorderedList mx={0}>{children}</UnorderedList>
);

export const Ol: FunctionComponent = ({ children }) => (
  <OrderedList mx={0}>{children}</OrderedList>
);

export const Li: FunctionComponent = ({ children }) => (
  <ListItem
    mb={4}
    sx={{
      "em:first-of-type": {
        mr: 2,
      },
      "&::marker": {
        color: "blue.500",
      },
    }}
  >
    {children}
  </ListItem>
);
