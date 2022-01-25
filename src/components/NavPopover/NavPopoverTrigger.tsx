import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  MenuButton,
  MenuButtonProps,
  forwardRef,
} from "@chakra-ui/react";

export const NavPopoverTrigger = forwardRef<MenuButtonProps, "button">(
  ({ children, ...props }, ref) => {
    return (
      <MenuButton
        as={Button}
        color="textPrimary"
        fontWeight="500"
        ref={ref}
        rightIcon={<ChevronDownIcon h={6} w={6} />}
        size="md"
        variant="link"
        {...props}
      >
        {children}
      </MenuButton>
    );
  }
);
