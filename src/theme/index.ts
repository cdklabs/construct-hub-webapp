import { extendTheme } from "@chakra-ui/react";
import { components } from "./components";
import { foundations } from "./foundations";

export const theme = extendTheme({
  ...foundations,
  components,
});
