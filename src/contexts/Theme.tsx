import { ChakraProvider } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PageLoader } from "../components/PageLoader";
import { makeTheme } from "../theme";
import { useConfig } from "./Config";

export const Theme: FunctionComponent = ({ children }) => {
  const { loading, data } = useConfig();
  return loading ? (
    <PageLoader />
  ) : (
    <ChakraProvider resetCSS theme={makeTheme(data!)}>
      {children}
    </ChakraProvider>
  );
};
