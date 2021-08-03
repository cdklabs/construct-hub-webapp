import { Link, HTMLChakraProps, ListItem, forwardRef } from "@chakra-ui/react";
import type { KeyboardEventHandler } from "react";

export interface SearchItemProps extends HTMLChakraProps<"li"> {
  name: string;
  href?: string;
  onClick?: () => void;
}

export const SearchItem = forwardRef<SearchItemProps, "li">(
  ({ name, href, onClick, ...props }, ref) => {
    const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
      if (e.key === "Enter") {
        onClick?.();
      }
    };

    return (
      <ListItem
        alignItems="center"
        as={href ? Link : undefined}
        display="flex"
        fontSize="lg"
        h={12}
        href={href}
        lineHeight="base"
        listStyleType="none"
        onClick={onClick}
        onKeyDown={onKeyDown}
        px={4}
        ref={ref}
        role="option"
        sx={{ ":hover, :focus": { bg: "gray.100" } }}
        tabIndex={0}
        {...props}
      >
        {name}
      </ListItem>
    );
  }
);

SearchItem.displayName = "SearchItem";
