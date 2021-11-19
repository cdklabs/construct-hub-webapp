import { IconButton, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { getFullPackageName } from "../../api/package/util";
import {
  Language,
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_RENDER_MAP,
  LANGUAGES,
} from "../../constants/languages";
import { getPackagePath } from "../../util/url";
import { usePackageState } from "../../views/Package/PackageState";
import { LanguageSupportTooltip } from "../LanguageSupportTooltip";

export interface LanguageBarProps {
  targetLanguages: readonly Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
}

export const LanguageBar: FunctionComponent<LanguageBarProps> = ({
  targetLanguages,
  selectedLanguage,
}) => {
  const { name, scope, version } = usePackageState();
  const { push } = useHistory();
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
            // reset to package root since our URL scheme for APIs currently
            // differs between languages.
            push(
              getPackagePath({
                name: getFullPackageName(name, scope),
                version,
                language,
              })
            );
          };

          return (
            <LanguageSupportTooltip key={language} language={language}>
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
