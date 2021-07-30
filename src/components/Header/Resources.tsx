import type { FunctionComponent } from "react";
import { RESOURCES } from "../../constants/links";
import {
  NavPopover,
  NavPopoverContent,
  NavPopoverTrigger,
} from "../NavPopover";

export const Resources: FunctionComponent = () => {
  return (
    <NavPopover>
      <NavPopoverTrigger>Resources</NavPopoverTrigger>
      <NavPopoverContent items={RESOURCES} />
    </NavPopover>
  );
};
