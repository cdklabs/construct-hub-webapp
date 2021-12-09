import type { FunctionComponent } from "react";
import { GETTING_STARTED } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import { HEADER_ANALYTICS } from "./constants";
import testIds from "./testIds";

export const GettingStartedDropdown: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger
      data-event={HEADER_ANALYTICS.GETTING_STARTED_DROPDOWN.MENU}
      data-testid={testIds.gettingStartedTrigger}
    >
      Getting Started
    </NavPopoverTrigger>
    <NavPopoverContent
      data-event={HEADER_ANALYTICS.GETTING_STARTED_DROPDOWN.LINK}
      data-testid={testIds.gettingStartedMenu}
      items={GETTING_STARTED}
    />
  </NavPopover>
);
