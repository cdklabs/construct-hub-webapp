import { FunctionComponent } from "react";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { CheckboxFilter } from "./CheckboxFilter";
import { useSearchState } from "./SearchState";

const languageOptions = Object.entries(LANGUAGE_NAME_MAP)
  .filter(([key]) => TEMP_SUPPORTED_LANGUAGES.has(key as Language))
  .map(([key, value]) => ({
    display: value,
    value: key,
  }));

export const LanguageFilter: FunctionComponent = () => {
  const { languages, setLanguages } = useSearchState().searchAPI;

  const onLanguagesChange = (lang: string) => {
    const language = lang as Language;

    setLanguages(
      languages.includes(language)
        ? languages.filter((l) => l !== language)
        : [...languages, language]
    );
  };

  return (
    <CheckboxFilter
      hint="Select one or more programming languages to filter by. Results will match at least one of the selected languages. If no languages are selected, results will not be filtered by langauges."
      name="Programming Language"
      onValueChange={onLanguagesChange}
      options={languageOptions}
      values={languages}
    />
  );
};
