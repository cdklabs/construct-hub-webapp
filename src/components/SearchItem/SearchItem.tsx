import { HTMLChakraProps, ListItem, forwardRef } from "@chakra-ui/react";
import type { KeyboardEventHandler } from "react";

export interface SearchItemProps extends HTMLChakraProps<"li"> {
  name: string;
  onClick: () => void;
}

export const SearchItem = forwardRef<SearchItemProps, "li">(
  ({ name, onClick, ...props }, ref) => {
    const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
      if (e.key === "Enter") {
        onClick();
      }
    };

    return (
      <ListItem
        alignItems="center"
        display="flex"
        fontSize="lg"
        h={12}
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
