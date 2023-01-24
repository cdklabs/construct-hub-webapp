import { extendTheme } from "@chakra-ui/react";
import { makeComponents } from "./components";
import { foundations } from "./foundations";
import { Config } from "../api/config";

export const makeTheme = (config: Config) => {
  const componentsConfig = {
    Tag: config?.packageTags ?? [],
  };

  return extendTheme({
    ...foundations,
    components: makeComponents(componentsConfig),
    config: {
      initialColorMode: "system",
      useSystemColorMode: false,
    },
  });
};
