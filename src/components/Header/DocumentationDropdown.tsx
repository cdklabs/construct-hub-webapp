import type { FunctionComponent } from "react";
import { HEADER_ANALYTICS } from "./constants";
import testIds from "./testIds";
import { DOCUMENTATION } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";

export const DocumentationDropdown: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger
      data-event={HEADER_ANALYTICS.DOCUMENTATION_DROPDOWN.MENU}
      data-testid={testIds.documentationTrigger}
    >
      Documentation
    </NavPopoverTrigger>
    <NavPopoverContent
      data-event={HEADER_ANALYTICS.DOCUMENTATION_DROPDOWN.LINK}
      data-testid={testIds.documentationMenu}
      items={DOCUMENTATION}
    />
  </NavPopover>
);
