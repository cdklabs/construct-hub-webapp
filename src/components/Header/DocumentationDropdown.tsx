import type { FunctionComponent } from "react";
import { DOCUMENTATION } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import testIds from "./testIds";

export const DocumentationDropdown: FunctionComponent = () => {
  return (
    <NavPopover>
      <NavPopoverTrigger data-testid={testIds.documentationTrigger}>
        Documentation
      </NavPopoverTrigger>
      <NavPopoverContent
        data-testid={testIds.documentationMenu}
        items={DOCUMENTATION}
      />
    </NavPopover>
  );
};
