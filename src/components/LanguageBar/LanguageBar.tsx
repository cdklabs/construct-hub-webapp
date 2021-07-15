import { IconButton, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
} from "../../constants/languages";

export interface LanguageBarProps {
  targetLanguages: readonly Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  showDisabled?: boolean;
}

export const LanguageBar: FunctionComponent<LanguageBarProps> = ({
  targetLanguages,
  selectedLanguage,
  setSelectedLanguage,
  showDisabled = false,
}) => {
  const displayable = showDisabled ? LANGUAGES : targetLanguages;
  const targetLanguageSet = new Set(targetLanguages);
  return (
    <Stack
      align="center"
      data-testid="language-bar"
      direction="row"
      spacing={2}
    >
      {displayable.map((language: Language) => {
        const isDisabled = !targetLanguageSet.has(language);
        const isSelected = language === selectedLanguage;

        const { icon: LangIcon } = LANGUAGE_RENDER_MAP[language];

        const onClick = () => {
          if (isSelected) return;
          setSelectedLanguage(language);
        };

        return (
          <IconButton
            aria-label={`Select ${language} icon`}
            border={isSelected ? "1px solid" : "none"}
            borderColor="blue.500"
            borderRadius="lg"
            boxShadow="base"
            colorScheme="blue"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            data-testid={`language-${language}`}
            disabled={isDisabled}
            icon={
              <LangIcon
                aria-label={`${language}-icon`}
                borderRadius="sm"
                height={[4, 5, 6]}
                width={[4, 5, 6]}
              />
            }
            key={language}
            onClick={onClick}
            p={1}
            variant="outline"
            w="max-content"
          />
        );
      })}
    </Stack>
  );
};
