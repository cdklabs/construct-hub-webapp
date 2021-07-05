import { extendTheme, theme as baseTheme } from "@chakra-ui/react";
import { colors } from "./colors";

export const theme = extendTheme({
  colors: {
    ...baseTheme.colors,
    ...colors,
  },
});
