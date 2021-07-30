import type { FunctionComponent } from "react";
import { DOCUMENTATION } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";

export const Documentation: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger>Getting Started</NavPopoverTrigger>
    <NavPopoverContent items={DOCUMENTATION} />
  </NavPopover>
);
