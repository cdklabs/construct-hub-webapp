import { SearchIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Input,
  forwardRef,
} from "@chakra-ui/react";
import { FormEventHandler, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export interface SearchInputProps {
  value: string;
  onChange: (s: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const SearchInput = forwardRef<SearchInputProps, "input">(
  ({ value, onChange, onSubmit }, inputRef) => {
    const [inputValue, setInputValue] = useState(value);
    const debounced = useDebounce(inputValue, 250);

    useEffect(() => {
      onChange(debounced);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    return (
      <form onSubmit={onSubmit}>
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search"
            ref={inputRef}
            value={inputValue}
            variant="filled"
          />
        </InputGroup>
      </form>
    );
  }
);
