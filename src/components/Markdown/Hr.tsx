import { Divider, DividerProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const Hr: FunctionComponent<DividerProps> = (props) => (
  <Divider my={10} {...props} />
);
