import { Button, Grid, Input } from "@chakra-ui/react";
import type {
  ChangeEventHandler,
  FormEventHandler,
  FunctionComponent,
} from "react";
import {
  Language,
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_NAME_MAP,
} from "../../constants/languages";
import { createTestIds } from "../../util/createTestIds";
import { Dropdown, DropdownProps } from "./Dropdown";

type LanguageItems = Partial<Record<Language, string>>;

const languageOptions = Object.fromEntries(
  Object.entries(LANGUAGE_NAME_MAP).filter(([key]) =>
    TEMP_SUPPORTED_LANGUAGES.includes(key as Language)
  )
) as LanguageItems;

const LanguageDropdown: FunctionComponent<DropdownProps<LanguageItems>> =
  Dropdown;

export const testIds = createTestIds("catalog-search", [
  "form",
  "input",
  "languageDropdown",
  "languageDropdownMenu",
  "languageDropdownValue",
  "languageItem",
  "submit",
] as const);

export interface CatalogSearchProps {
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
  language: Language | null;
  /**
   * Controls the language state change event
   */
  onLanguageChange: (language: Language | null) => void;
  /**
   * Called when the catalog search form is submitted (via enter keypress or submit click)
   */
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const CatalogSearch: FunctionComponent<CatalogSearchProps> = ({
  query,
  onQueryChange,
  language,
  onLanguageChange,
  onSubmit,
}) => {
  return (
    <form data-testid={testIds.form} onSubmit={onSubmit}>
      <Grid
        autoRows="1fr"
        gap={4}
        templateColumns={{ sm: "1fr", md: "3fr 1fr 1fr" }}
        width="full"
      >
        <Input
          bg="white"
          boxShadow="base"
          data-testid={testIds.input}
          name="query"
          onChange={onQueryChange}
          placeholder="Search providers or modules..."
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
      </Grid>
    </form>
  );
};
