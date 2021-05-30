import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({});

export function Theme(props: { children: JSX.Element }) {
  return <ChakraProvider theme={theme}>{props.children}</ChakraProvider>;
}
