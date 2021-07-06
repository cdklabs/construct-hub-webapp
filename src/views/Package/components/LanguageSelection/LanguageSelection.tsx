import { Flex } from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import type { FunctionComponent } from "react";
import { LanguageBar } from "../../../../components/LanguageBar";
import {
  Language,
  Languages,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../../../constants/languages";
import { useLanguage } from "../../../../hooks/useLanguage";
import { UseConstruct } from "../UseConstruct";

export interface LanguageSelectionProps {
  assembly: Assembly;
}

export const LanguageSelection: FunctionComponent<LanguageSelectionProps> = ({
  assembly,
}) => {
  const [language, setLanguage] = useLanguage({
    updateSaved: true,
    updateUrl: true,
  });
  const targets = [
    ...Object.keys(assembly?.spec?.targets ?? {}),
    // typescript is the source language and hence always supported.
    // (it doesn't appear in spec.targets)
    Languages.TypeScript,
  ] as Language[];

  return (
    <Flex align="center" justify="space-between">
      <Flex direction="column">
        <LanguageBar
          selectedLanguage={targets.includes(language) ? language : targets[0]}
          setSelectedLanguage={setLanguage}
          showDisabled
          targetLanguages={targets.filter((target) =>
            TEMP_SUPPORTED_LANGUAGES.includes(target)
          )}
        />
      </Flex>
      <UseConstruct packageName={assembly.name} />
    </Flex>
  );
};
