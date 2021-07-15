import { Text } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { GETTING_STARTED } from "../../constants/links";
import { NavPopover } from "./NavPopover";
import { NavPopoverContent } from "./NavPopoverContent";
import { NavPopoverTrigger } from "./NavPopoverTrigger";

export default {
  title: "Components / NavPopover",
  component: NavPopover,
};

export const Primary = () => (
  <MemoryRouter>
    <NavPopover>
      <NavPopoverTrigger>
        <Text>Getting Started</Text>
      </NavPopoverTrigger>
      <NavPopoverContent items={GETTING_STARTED} />
    </NavPopover>
  </MemoryRouter>
);
