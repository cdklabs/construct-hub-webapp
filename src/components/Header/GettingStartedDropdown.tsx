import type { FunctionComponent } from "react";
import { GETTING_STARTED } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import testIds from "./testIds";

export const GettingStartedDropdown: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger data-testid={testIds.gettingStartedTrigger}>
      Getting Started
    </NavPopoverTrigger>
    <NavPopoverContent
      data-testid={testIds.gettingStartedMenu}
      items={GETTING_STARTED}
    />
  </NavPopover>
);
