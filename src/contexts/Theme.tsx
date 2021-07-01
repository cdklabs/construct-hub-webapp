import { ChakraProvider } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { theme } from "../theme";

export const Theme: FunctionComponent = ({ children }) => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      {children}
    </ChakraProvider>
  );
};
