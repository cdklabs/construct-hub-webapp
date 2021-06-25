import { Flex, Text, Icon, PropsOf } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Language, LANGUAGES } from "../../constants/languages";
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
    name: "TypeScript",
    icon: TSIcon,
  },
  python: {
    name: "Python",
    icon: PythonIcon,
  },
  java: {
    name: "Java",
    icon: JavaIcon,
  },
  js: {
    name: "Node.js",
    icon: NodeIcon,
  },
  golang: {
    name: "Go",
    icon: GoIcon,
  },
  dotnet: {
    name: ".NET",
    icon: DotNetIcon,
  },
};

export const LanguageBar: FunctionComponent<LanguageBarProps> = ({
  targetLanguages,
  selectedLanguage,
  setSelectedLanguage,
  showDisabled = false,
}) => {
  return (
    <Flex data-testid="language-bar">
      {(showDisabled ? LANGUAGES : targetLanguages).map(
        (language: Language) => {
          const isDisabled = !targetLanguages.includes(language);
          const isSelected = language === selectedLanguage;

          const { name, icon: LangIcon } = LANGUAGE_MAP[language];

          const onClick = () => {
            if (isSelected) return;
            setSelectedLanguage(language);
          };

          return (
            <Flex
              align="center"
              as="button"
              borderBottom={isSelected && !isDisabled ? "2px solid" : "none"}
              borderColor="blue.500"
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
              px={4}
              py={2}
              sx={{
                ":hover:not(:disabled)": {
                  bg: "gray.100",
                },
              }}
              type="button"
            >
              <LangIcon height="2rem" width="2rem" />
              <Text fontSize="sm" mt={2}>
                {name}
              </Text>
            </Flex>
          );
        }
      )}
    </Flex>
  );
};
