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
  url?: string;
  value: string;
  onChange: (s: string) => void;
}

export const SearchInput = forwardRef<SearchInputProps, "input">(
  ({ value, onChange, url }, inputRef) => {
    const [inputValue, setInputValue] = useState(value);

    useDebounce(inputValue, { onChange });

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
      if (!url) {
        e.preventDefault();
      }
    };

    return (
      <Form
        action={url}
        data-testid="choose-submodule-search-form"
        method="get"
        onSubmit={onSubmit}
      >
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
