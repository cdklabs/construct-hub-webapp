import { HTMLChakraProps, ListItem, forwardRef } from "@chakra-ui/react";
import type { KeyboardEventHandler, ReactNode } from "react";

export interface SearchItemProps extends HTMLChakraProps<"li"> {
  name: ReactNode;
  onClick: () => void;
}

export const SearchItem = forwardRef<SearchItemProps, "li">(
  ({ name, onClick, ...props }, ref) => {
    const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
      if (["Enter", " "].includes(e.key)) {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <ListItem
        alignItems="center"
        display="flex"
        fontSize="md"
        lineHeight="base"
        listStyleType="none"
        minH={8}
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
