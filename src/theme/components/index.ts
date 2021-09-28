import { theme } from "@chakra-ui/react";
import { PackageTagConfig } from "../../api/config";
import { Code } from "./Code";
import { Divider } from "./Divider";
import { makeTag } from "./Tag";

interface ComponentsConfig {
  Tag: PackageTagConfig[];
}

export const makeComponents = (config: ComponentsConfig) => {
  return {
    ...theme.components,
    Code,
    Divider,
    Tag: makeTag(config.Tag),
  };
};
