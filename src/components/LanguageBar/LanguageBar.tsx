import { Flex, Grid, Icon, PropsOf } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  Language,
  LANGUAGES,
  LANGUAGE_NAME_MAP,
} from "../../constants/languages";
import { DotNetIcon } from "../../icons/DotNetIcon";
import { GoIcon } from "../../icons/GoIcon";
import { JavaIcon } from "../../icons/JavaIcon";
import { NodeIcon } from "../../icons/NodeIcon";
import { PythonIcon } from "../../icons/PythonIcon";
import { TSIcon } from "../../icons/TSIcon";

export interface LanguageBarProps {
  targetLanguages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  showDisabled?: boolean;
}

const LANGUAGE_MAP: Record<
  Language,
  { name: string; icon: FunctionComponent<PropsOf<typeof Icon>> }
> = {
  ts: {
    name: LANGUAGE_NAME_MAP.ts,
    icon: TSIcon,
  },
  python: {
    name: LANGUAGE_NAME_MAP.python,
    icon: PythonIcon,
  },
  java: {
    name: LANGUAGE_NAME_MAP.java,
    icon: JavaIcon,
  },
  js: {
    name: LANGUAGE_NAME_MAP.js,
    icon: NodeIcon,
  },
  golang: {
    name: LANGUAGE_NAME_MAP.golang,
    icon: GoIcon,
  },
  dotnet: {
    name: LANGUAGE_NAME_MAP.dotnet,
    icon: DotNetIcon,
  },
};

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

        const { icon: LangIcon } = LANGUAGE_MAP[language];

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
            borderRadius="md"
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
            p={2}
            sx={{
              ":hover:not(:disabled)": {
                bg: "gray.100",
              },
            }}
            type="button"
          >
            <LangIcon borderRadius="50%" height="2rem" width="2rem" />
          </Flex>
        );
      })}
    </Grid>
  );
};
