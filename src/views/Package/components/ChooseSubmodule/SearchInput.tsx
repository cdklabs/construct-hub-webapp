import { SearchIcon } from "@chakra-ui/icons";
import {
  InputGroup,
  InputLeftElement,
  Input,
  forwardRef,
} from "@chakra-ui/react";
import { FormEventHandler, useState } from "react";
import { Form } from "components/Form";
import { useDebounce } from "hooks/useDebounce";

export interface SearchInputProps {
  value: string;
  onChange: (s: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const SearchInput = forwardRef<SearchInputProps, "input">(
  ({ value, onChange, onSubmit }, inputRef) => {
    const [inputValue, setInputValue] = useState(value);

    useDebounce(inputValue, { onChange });

    return (
      <Form data-testid="choose-submodule-search-form" onSubmit={onSubmit}>
        <InputGroup>
          <InputLeftElement>
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            data-testid="choose-submodule-search-input"
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search"
            ref={inputRef}
            value={inputValue}
            variant="filled"
          />
        </InputGroup>
      </Form>
    );
  }
);

SearchInput.displayName = "SearchInput";
