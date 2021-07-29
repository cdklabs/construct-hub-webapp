import type { FunctionComponent } from "react";
import { COMMUNITY } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";

export const Community: FunctionComponent = () => (
  <NavPopover>
    <NavPopoverTrigger>Community</NavPopoverTrigger>
    <NavPopoverContent items={COMMUNITY} />
  </NavPopover>
);
