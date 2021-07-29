import type { FunctionComponent } from "react";
import { GETTING_STARTED } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";

export const GettingStarted: FunctionComponent = () => {
  return (
    <NavPopover>
      <NavPopoverTrigger>Documentation</NavPopoverTrigger>
      <NavPopoverContent items={GETTING_STARTED} />
    </NavPopover>
  );
};
