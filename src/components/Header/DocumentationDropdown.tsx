import type { FunctionComponent } from "react";
import { DOCUMENTATION } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import { HEADER_ANALYTICS } from "./constants";
import testIds from "./testIds";

export const DocumentationDropdown: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger
      data-event={HEADER_ANALYTICS.DOCUMENTATION.MENU}
      data-testid={testIds.documentationTrigger}
    >
      Documentation
    </NavPopoverTrigger>
    <NavPopoverContent
      data-event={HEADER_ANALYTICS.DOCUMENTATION.LINK}
      data-testid={testIds.documentationMenu}
      items={DOCUMENTATION}
    />
  </NavPopover>
);
