import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

const theme = extendTheme({});

export const Theme: FunctionComponent = ({ children }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  );
};
