import type { Assembly } from "@jsii/spec";
import type { FunctionComponent } from "react";
import {
  CodePopover,
  CodePopoverTrigger,
} from "../../../../components/CodePopover";
import {
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_NAME_MAP,
  Language,
} from "../../../../constants/languages";
import { useLanguage } from "../../../../hooks/useLanguage";

// TODO: We'll probably want to get this from BE as we add more languages, however this should do the trick for now...
const getCodeSample = ({
  language,
  assembly,
}: {
  language: Language;
  assembly: Assembly;
}) => {
  const version = assembly.version;
  if (language === Language.TypeScript) {
    const packageName = assembly.name;
    return `npm install ${packageName}@${version}`;
  } else if (language === Language.Python) {
    const packageName = assembly.targets?.python?.distName;
    if (!packageName) {
      return "# Unsupported";
    }
    return `pip install ${packageName}==${version}`;
  }

  return "";
};

export interface UseConstructProps {
  assembly: Assembly;
}

export const UseConstruct: FunctionComponent<UseConstructProps> = ({
  assembly,
}) => {
  const [language] = useLanguage();

  const header = LANGUAGE_NAME_MAP[language];
  const code = getCodeSample({ language, assembly });

  const supported =
    language === Language.TypeScript &&
    assembly.targets?.[language.toString()] != null;
  const disabled = !TEMP_SUPPORTED_LANGUAGES.has(language) || !supported;
  const label = supported ? "Install" : "Unsupported";

  const trigger = (
    <CodePopoverTrigger disabled={disabled}>{label}</CodePopoverTrigger>
  );

  return <CodePopover code={code} header={header} trigger={trigger} />;
};
