import {
  Box,
  Divider,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  UnorderedList,
} from "@chakra-ui/react";
import { FormEventHandler, ReactNode, useCallback, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Result } from "./Result";
import { SearchInput } from "./SearchInput";

export interface SearchPopoverProps {
  inputValue: string;
  isOpen: boolean;
  onClose: () => void;
  onInputChange: (s: string) => void;
  submodules: { name: string; to: string }[];
  trigger: ReactNode;
}

export function SearchPopover({
  inputValue,
  isOpen,
  onClose,
  onInputChange,
  submodules,
  trigger,
}: SearchPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useHistory();

  const navigate = useCallback(
    (to: string) => {
      push(to);
      onClose();
    },
    [onClose, push]
  );

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();

      if (!submodules.length) return;
      const { to } = submodules[0];
      navigate(to);
    },
    [navigate, submodules]
  );

  return (
    <Popover
      initialFocusRef={inputRef}
      isLazy
      isOpen={isOpen}
      offset={[20, -15]}
      onClose={onClose}
      strategy="fixed"
    >
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent boxShadow="2xl">
        <PopoverCloseButton data-testid="choose-submodule-popover-close" />
        <PopoverHeader
          data-testid="choose-submodule-popover-header"
          fontSize="lg"
          fontWeight="bold"
        >
          Choose a submodule
        </PopoverHeader>
        <PopoverBody data-testid="choose-submodule-popover-body" p={0}>
          <Box p={4}>
            <SearchInput
              onChange={onInputChange}
              onSubmit={onSubmit}
              ref={inputRef}
              value={inputValue}
            />
          </Box>
          <Divider bg="blue.100" />
          <UnorderedList
            data-testid="choose-submodule-popover-results"
            m={0}
            maxH="50vh"
            overflow="hidden auto"
            p={0}
            role="listbox"
            tabIndex={-1}
          >
            {submodules.map(({ name, to }) => (
              <Result key={name} name={name} onClick={() => navigate(to)} />
            ))}
          </UnorderedList>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
