import { UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Ul: FunctionComponent = ({ children }) => (
  <UnorderedList marginTop={2} padding={0}>
    {children}
  </UnorderedList>
);

export const Ol: FunctionComponent = ({ children }) => (
  <OrderedList>{children}</OrderedList>
);

export const Li: FunctionComponent = ({ children }) => (
  <ListItem
    lineHeight="tall"
    marginX={2}
    sx={{
      "em:first-of-type": {
        fontSize: "small",
      },
      code: {
        fontSize: "small",
      },
    }}
  >
    {children}
  </ListItem>
);
