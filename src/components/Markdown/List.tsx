import { UnorderedList, OrderedList, ListItem } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Ul: FunctionComponent = ({ children }) => (
  <UnorderedList marginTop="1em" padding="0em">
    {children}
  </UnorderedList>
);

export const Ol: FunctionComponent = ({ children }) => (
  <OrderedList>{children}</OrderedList>
);

export const Li: FunctionComponent = ({ children }) => (
  <ListItem
    lineHeight="tall"
    marginX="0.5em"
    mb={0}
    sx={{
      "em:first-of-type": {
        fontSize: "small",
      },
      "&::marker": {
        color: "gray.600",
      },
      code: {
        fontSize: "small",
      },
    }}
  >
    {children}
  </ListItem>
);
