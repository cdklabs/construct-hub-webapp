import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useConfig } from "./Config";
import { PageLoader } from "../components/PageLoader";
import { makeTheme } from "../theme";

export const Theme: FunctionComponent = ({ children }) => {
  const { isLoading, data } = useConfig();
  return (
    <>
      <ColorModeScript initialColorMode="system" />
      {isLoading ? (
        <PageLoader />
      ) : (
        <ChakraProvider resetCSS theme={makeTheme(data!)}>
          {children}
        </ChakraProvider>
      )}
    </>
  );
};
