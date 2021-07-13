import { Flex, Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
} from "../../constants/languages";

export interface LanguageBarProps {
  targetLanguages: Language[];
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
  return (
    <Grid
      data-testid="language-bar"
      gap="2"
      gridTemplateColumns={`repeat(${displayable.length}, 1fr)`}
      gridTemplateRows="1fr"
    >
      {displayable.map((language: Language) => {
        const isDisabled = !targetLanguages.includes(language);
        const isSelected = language === selectedLanguage;

        const { icon: LangIcon } = LANGUAGE_RENDER_MAP[language];

        const onClick = () => {
          if (isSelected) return;
          setSelectedLanguage(language);
        };

        return (
          <Flex
            align="center"
            as="button"
            bg="white"
            border={isSelected ? "1px solid" : "none"}
            borderColor="blue.500"
            borderRadius="lg"
            boxShadow="base"
            cursor={isDisabled ? "not-allowed" : "pointer"}
            data-disabled={isDisabled}
            data-selected={isSelected}
            data-testid={`language-${language}`}
            direction="column"
            disabled={isDisabled}
            filter={isDisabled ? "grayscale(100%)" : "none"}
            justify="center"
            key={language}
            onClick={onClick}
            opacity={isDisabled ? "0.5" : 1}
            p={1}
            sx={{
              ":hover:not(:disabled)": {
                bg: "gray.100",
              },
            }}
            type="button"
          >
            <LangIcon
              aria-label={`${language}-icon`}
              borderRadius="sm"
              height={[4, 5, 6]}
              width={[4, 5, 6]}
            />
          </Flex>
        );
      })}
    </Grid>
  );
};
