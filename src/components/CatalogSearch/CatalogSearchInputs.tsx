import { Button, forwardRef, Input } from "@chakra-ui/react";
import type { ChangeEventHandler, FunctionComponent } from "react";
import {
  Language,
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_NAME_MAP,
} from "../../constants/languages";
import { Dropdown, DropdownProps } from "./Dropdown";
import testIds from "./testIds";

type LanguageItems = Partial<Record<Language, string>>;

const languageOptions = Object.fromEntries(
  Object.entries(LANGUAGE_NAME_MAP).filter(([key]) =>
    TEMP_SUPPORTED_LANGUAGES.has(key as Language)
  )
) as LanguageItems;

const LanguageDropdown: FunctionComponent<DropdownProps<LanguageItems>> =
  Dropdown;

export interface CatalogSearchInputsProps {
  /**
   * Controls the query state value
   */
  query: string;
  /**
   * Controls the query state change event
   */
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
  /**
   * Controls the language state value
   */
  language?: Language;
  /**
   * Controls the language state change event
   */
  onLanguageChange: (language?: Language) => void;
}

export const CatalogSearchInputs = forwardRef<
  CatalogSearchInputsProps,
  "input"
>(({ query, onQueryChange, language, onLanguageChange }, ref) => (
  <>
    <Input
      bg="white"
      borderColor="blue.100"
      boxShadow="base"
      data-testid={testIds.input}
      name="query"
      onChange={onQueryChange}
      placeholder="Search Constructs..."
      ref={ref}
      value={query}
    />
    <LanguageDropdown
      items={languageOptions}
      onSelect={onLanguageChange}
      placeholder="Language..."
      selected={language}
      testIds={{
        item: testIds.languageItem,
        menu: testIds.languageDropdownMenu,
        trigger: testIds.languageDropdown,
        value: testIds.languageDropdownValue,
      }}
    />
    <Button
      boxShadow="base"
      colorScheme="blue"
      data-testid={testIds.submit}
      type="submit"
    >
      Search
    </Button>
  </>
));
