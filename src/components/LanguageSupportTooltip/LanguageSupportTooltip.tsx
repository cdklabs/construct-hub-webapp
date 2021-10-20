import { Tooltip } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";

export interface LanguageSupportTooltipProps {
  language: Language;
}

export const LanguageSupportTooltip: FunctionComponent<LanguageSupportTooltipProps> =
  ({ children, language }) => {
    const isSupported = TEMP_SUPPORTED_LANGUAGES.has(language);
    const langName = LANGUAGE_NAME_MAP[language];

    const message = isSupported
      ? `Click to view documentation in ${langName}`
      : `Documentation support for ${langName} is coming soon!`;

    return (
      <Tooltip hasArrow label={message} placement="top-start">
        <span>{children}</span>
      </Tooltip>
    );
  };
