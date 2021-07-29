import { UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Ul: FunctionComponent = ({ children }) => (
  <UnorderedList>{children}</UnorderedList>
);

export const Ol: FunctionComponent = ({ children }) => (
  <OrderedList>{children}</OrderedList>
);

export const Li: FunctionComponent = ({ children }) => (
  <ListItem
    lineHeight="tall"
    sx={{
      "em:first-of-type": {
        mr: 2,
        fontStyle: "italic",
        fontSize: "small",
      },
      "&::marker": {
        color: "blue.500",
      },
      code: {
        fontSize: "small",
      },
    }}
  >
    {children}
  </ListItem>
);
