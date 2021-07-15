import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  MenuButton,
  MenuButtonProps,
  forwardRef,
  Text,
} from "@chakra-ui/react";

export const NavPopoverTrigger = forwardRef<MenuButtonProps, "button">(
  ({ children, ...props }, ref) => {
    return (
      <MenuButton
        as={Button}
        color="blue.800"
        ref={ref}
        rightIcon={<ChevronDownIcon h={6} w={6} />}
        size="md"
        variant="link"
        {...props}
      >
        {typeof children === "string" ? (
          <Text isTruncated>{children}</Text>
        ) : (
          children
        )}
      </MenuButton>
    );
  }
);
