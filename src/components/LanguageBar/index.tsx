import { Flex, Text } from "@chakra-ui/react";
import { DotNetIcon } from "../../icons/DotNetIcon";
import { GoIcon } from "../../icons/GoIcon";
import { JavaIcon } from "../../icons/JavaIcon";
import { NodeIcon } from "../../icons/NodeJsIcon";
import { PythonIcon } from "../../icons/PythonIcon";
import { TSIcon } from "../../icons/TSIcon";

export type Language = "dotnet" | "js" | "ts" | "python" | "golang" | "java";

export interface LanguageBarProps {
  targetLanguages: Language[];
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
}

const ALL_LANGUAGES: Language[] = [
  "ts",
  "python",
  "java",
  "js",
  "golang",
  "dotnet",
];

const ICON_MAP = {
  ts: TSIcon,
  js: NodeIcon,
  python: PythonIcon,
  golang: GoIcon,
  dotnet: DotNetIcon,
  java: JavaIcon,
};

const NAME_MAP: Record<Language, string> = {
  ts: "TypeScript",
  python: "Python",
  java: "Java",
  js: "Node.js",
  golang: "Go",
  dotnet: ".NET",
};

export function LanguageBar({
  targetLanguages,
  selectedLanguage,
  setSelectedLanguage,
}: LanguageBarProps) {
  return (
    <Flex justify="center">
      {ALL_LANGUAGES.map((language) => {
        const isDisabled = !targetLanguages.includes(language);
        const isSelected = language === selectedLanguage;

        const name = NAME_MAP[language];
        const Icon = ICON_MAP[language];

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
            data-test={`language-${language}`}
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
            <Icon height="2rem" width="2rem" />
            <Text fontSize="sm" mt={2}>
              {name}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
