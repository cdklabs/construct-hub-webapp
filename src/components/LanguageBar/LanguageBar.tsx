import { IconButton, Link, Stack } from "@chakra-ui/react";
import { Assembly } from "@jsii/spec";
import type { FunctionComponent } from "react";
import {
  Language,
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_RENDER_MAP,
  LANGUAGES,
} from "../../constants/languages";
import { LanguageSupportTooltip } from "../LanguageSupportTooltip";
import { useLanguage } from "hooks/useLanguage";
import { getFullPackagePath } from "util/url";

const languageSet = new Set(LANGUAGES);
export interface LanguageBarProps {
  assembly: Assembly;
}

export const LanguageBar: FunctionComponent<LanguageBarProps> = ({
  assembly,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useLanguage({
    updateSaved: true,
  });

  const { name, version } = assembly;

  const targets = [
    ...Object.keys(assembly?.targets ?? {}),
    // typescript is the source language and hence always supported.
    // (it doesn't appear in spec.targets)
    Language.TypeScript,
  ] as Language[];

  const targetLanguages = targets.filter((target) => languageSet.has(target));

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
            setSelectedLanguage(language);
          };

          const isLink = !isDisabled;

          return (
            <LanguageSupportTooltip key={language} language={language}>
              <IconButton
                aria-label={`Select ${language} icon`}
                as={isLink ? Link : undefined}
                border={isSelected ? "1px solid" : "none"}
                borderColor="blue.500"
                borderRadius="lg"
                boxShadow="base"
                colorScheme="blue"
                cursor={isDisabled ? "not-allowed" : "pointer"}
                data-testid={`language-${language}`}
                disabled={isDisabled}
                href={
                  isLink
                    ? getFullPackagePath({ name, version, lang: language })
                    : undefined
                }
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
