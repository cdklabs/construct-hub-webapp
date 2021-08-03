import { Text } from "@chakra-ui/react";
import { RESOURCES } from "../../constants/links";
import { NavPopover } from "./NavPopover";
import { NavPopoverContent } from "./NavPopoverContent";
import { NavPopoverTrigger } from "./NavPopoverTrigger";

export default {
  title: "Components / NavPopover",
  component: NavPopover,
};

export const Primary = () => (
  <NavPopover>
    <NavPopoverTrigger>
      <Text>Resources</Text>
    </NavPopoverTrigger>
    <NavPopoverContent items={RESOURCES} />
  </NavPopover>
);
