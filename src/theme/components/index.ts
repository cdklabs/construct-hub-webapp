import { theme } from "@chakra-ui/react";
import { PackageTagConfig } from "../../api/config";
import { Checkbox } from "./Checkbox";
import { Code } from "./Code";
import { Divider } from "./Divider";
import { Radio } from "./Radio";
import { Tabs } from "./Tabs";
import { makeTag } from "./Tag";

interface ComponentsConfig {
  Tag: PackageTagConfig[];
}

export const makeComponents: any = (config: ComponentsConfig) => {
  return {
    ...theme.components,
    Checkbox,
    Code,
    Divider,
    Radio,
    Tag: makeTag(config.Tag),
    Tabs,
  };
};
