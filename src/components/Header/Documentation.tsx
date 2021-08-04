import type { FunctionComponent } from "react";
import { DOCUMENTATION } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import { testIds } from "./constants";

export const Documentation: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger data-testid={testIds.gettingStartedTrigger}>
      Getting Started
    </NavPopoverTrigger>
    <NavPopoverContent
      data-testid={testIds.gettingStartedMenu}
      items={DOCUMENTATION}
    />
  </NavPopover>
);
