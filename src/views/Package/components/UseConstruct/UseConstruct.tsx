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
  version,
}: {
  language: Language;
  packageName: string;
  version: string;
}) => {
  if (language === Languages.TypeScript) {
    return `npm install ${packageName}@${version}`;
  } else if (language === Languages.Python) {
    return `pip install ${packageName}==${version}`;
  }

  return "";
};

export interface UseConstructProps {
  packageName: string;
  version: string;
}

export const UseConstruct: FunctionComponent<UseConstructProps> = ({
  packageName,
  version,
}) => {
  const [language] = useLanguage();

  const code = getCodeSample({ language, packageName, version });
  const header = LANGUAGE_NAME_MAP[language];

  const trigger = (
    <CodePopoverTrigger disabled={!TEMP_SUPPORTED_LANGUAGES.includes(language)}>
      Use Construct
    </CodePopoverTrigger>
  );

  return <CodePopover code={code} header={header} trigger={trigger} />;
};
