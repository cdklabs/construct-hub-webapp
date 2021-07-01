import type { FunctionComponent } from "react";
import {
  CodePopover,
  CodePopoverTrigger,
} from "../../../../components/CodePopover";
import {
  TEMP_SUPPORTED_LANGUAGES,
  LANGUAGE_NAME_MAP,
  Language,
  Languages,
} from "../../../../constants/languages";
import { useLanguage } from "../../../../hooks/useLanguage";

// TODO: We'll probably want to get this from BE as we add more languages, however this should do the trick for now...
const getCodeSample = ({
  language,
  packageName,
}: {
  language: Language;
  packageName: string;
}) => {
  if (language === Languages.TypeScript) {
    return `npm install ${packageName}`;
  } else if (language === Languages.Python) {
    return `pip install ${packageName}`;
  }

  return "";
};

export interface UseConstructProps {
  packageName: string;
}

export const UseConstruct: FunctionComponent<UseConstructProps> = ({
  packageName,
}) => {
  const [language] = useLanguage();

  const code = getCodeSample({ language, packageName });
  const header = LANGUAGE_NAME_MAP[language];

  const trigger = (
    <CodePopoverTrigger
      disabled={!TEMP_SUPPORTED_LANGUAGES.includes(language)}
      size="lg"
    >
      Use Construct
    </CodePopoverTrigger>
  );

  return <CodePopover code={code} header={header} trigger={trigger} />;
};
