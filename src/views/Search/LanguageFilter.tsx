import { FunctionComponent } from "react";
import { useRecoilState } from "recoil";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { languagesState } from "../../state/search";
import { CheckboxFilter } from "./CheckboxFilter";
import testIds from "./testIds";

const languageOptions = Object.entries(LANGUAGE_NAME_MAP)
  .map(([key, value]) => ({
    display: value,
    value: key,
    ...(TEMP_SUPPORTED_LANGUAGES.has(key as Language)
      ? { isDisabled: false }
      : {
          isDisabled: true,
          disabledHint: `${
            LANGUAGE_NAME_MAP[key as Language]
          } support is coming soon!`,
        }),
  }))
  .sort((l1, l2) => {
    // Push disabled languages to back of list
    return l1.isDisabled > l2.isDisabled ? 1 : -1;
  });

export const LanguageFilter: FunctionComponent = () => {
  const [languages, setLanguages] = useRecoilState(languagesState);

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
      data-testid={testIds.languagesFilter}
      hint="Choose one or more languages. Results include constructs for use with at least one of the selected languages."
      name="Programming Language"
      onValueChange={onLanguagesChange}
      options={languageOptions}
      values={languages}
    />
  );
};
