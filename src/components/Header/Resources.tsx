import type { FunctionComponent } from "react";
import { RESOURCES } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";
import { testIds } from "./constants";

export const Resources: FunctionComponent = () => {
  return (
    <NavPopover>
      <NavPopoverTrigger data-testid={testIds.resourcesTrigger}>
        Resources
      </NavPopoverTrigger>
      <NavPopoverContent
        data-testid={testIds.resourcesMenu}
        items={RESOURCES}
      />
    </NavPopover>
  );
};
