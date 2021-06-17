import { Button, Flex, Text } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import {
  Language,
  Languages,
  LANGUAGES,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { useLanguage } from "../../hooks/useLanguage";
import { Card } from "../Card";
import { LanguageBar } from "../LanguageBar";
import { DisabledLangPopover } from "./DisabledLangPopover";

export interface LanguageSelectionProps {
  assembly?: Assembly;
}

export function LanguageSelection({ assembly }: LanguageSelectionProps) {
  const [language, setLanguage] = useLanguage({ updateUrl: true });
  const targets = [
    ...Object.keys(assembly?.spec?.targets ?? {}),
    // typescript is the source language and hence always supported.
    // (it doesn't appear in spec.targets)
    Languages.TypeScript,
  ] as Language[];

  return (
    <Card align="center" as={Flex} justify="space-between" px={4} py={0}>
      <Flex direction="column">
        <Flex align="center" m={2}>
          <Text
            color="gray.500"
            fontWeight="semibold"
            mr={2}
            textTransform="uppercase"
          >
            Client Libraries
          </Text>
          {targets.length < LANGUAGES.length ? <DisabledLangPopover /> : null}
        </Flex>
        <LanguageBar
          selectedLanguage={targets.includes(language) ? language : targets[0]}
          setSelectedLanguage={setLanguage}
          showDisabled
          targetLanguages={targets.filter((target) =>
            TEMP_SUPPORTED_LANGUAGES.includes(target)
          )}
        />
      </Flex>
      <Button colorScheme="blue" disabled size="lg">
        Use Construct
      </Button>
    </Card>
  );
}
