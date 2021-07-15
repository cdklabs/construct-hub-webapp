import { Menu, MenuProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export interface NavPopoverProps extends MenuProps {}

export const NavPopover: FunctionComponent<NavPopoverProps> = ({
  children,
  ...menuProps
}) => {
  return (
    <Menu colorScheme="blue.800" strategy="fixed" {...menuProps}>
      {children}
    </Menu>
  );
};
