import { IconButton, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { PACKAGE_ANALYTICS } from "./constants";
import { LanguageSupportTooltip } from "../../components/LanguageSupportTooltip";
import {
  Language,
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_RENDER_MAP,
  LANGUAGES,
} from "../../constants/languages";
import { clickEvent, useAnalytics } from "../../contexts/Analytics";

export interface LanguageBarProps {
  targetLanguages: readonly Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
}

export const LanguageBar: FunctionComponent<LanguageBarProps> = ({
  targetLanguages,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const { trackCustomEvent } = useAnalytics();
  return (
    <Stack
      align="center"
      data-testid="language-bar"
      direction="row"
      spacing={2}
    >
      {[...targetLanguages]
        .sort(
          (left, right) => LANGUAGES.indexOf(left) - LANGUAGES.indexOf(right)
        )
        .map((language: Language) => {
          const isDisabled = !TEMP_SUPPORTED_LANGUAGES.has(language);
          const isSelected = language === selectedLanguage;

          const { icon: LangIcon } = LANGUAGE_RENDER_MAP[language];

          const onClick = () => {
            if (isSelected) return;
            trackCustomEvent(
              clickEvent({
                name: PACKAGE_ANALYTICS.LANGUAGE.eventName(language),
              })
            );
            setSelectedLanguage(language);
          };

          return (
            <LanguageSupportTooltip key={language} language={language}>
              <IconButton
                aria-label={`Select ${language} icon`}
                bg="bgSecondary"
                border="base"
                borderColor={isSelected ? "brand.500" : "borderColor"}
                borderRadius="lg"
                boxShadow="base"
                colorScheme="brand"
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
                onClick={onClick}
                p={1}
                variant="outline"
                w="max-content"
              />
            </LanguageSupportTooltip>
          );
        })}
    </Stack>
  );
};
