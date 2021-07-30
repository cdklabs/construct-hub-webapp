import { Divider, DividerProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Hr: FunctionComponent<DividerProps> = (props) => (
  <Divider
    borderBottomWidth="2px"
    borderColor="rgba(0, 124, 253, 0.15)"
    my={4}
    {...props}
  />
);
