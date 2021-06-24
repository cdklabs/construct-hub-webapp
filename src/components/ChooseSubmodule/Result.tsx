import { ListItem } from "@chakra-ui/react";
import type { KeyboardEventHandler } from "react";

export interface ResultProps {
  name: string;
  onClick: () => void;
}

export function Result({ name, onClick }: ResultProps) {
  const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
    if (e.key === "Enter") {
      onClick();
    }
  };

  return (
    <ListItem
      alignItems="center"
      data-testid="choose-submodule-result"
      display="flex"
      fontSize="lg"
      h={12}
      lineHeight="base"
      listStyleType="none"
      onClick={onClick}
      onKeyDown={onKeyDown}
      px={4}
      role="option"
      sx={{ ":hover, :focus": { bg: "gray.100" } }}
      tabIndex={0}
    >
      {name}
    </ListItem>
  );
}
