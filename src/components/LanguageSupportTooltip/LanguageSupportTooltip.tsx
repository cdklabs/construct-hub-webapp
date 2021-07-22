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

    if (isSupported) {
      return <>{children}</>;
    }

    return (
      <Tooltip
        hasArrow
        label={`Documentation support for ${LANGUAGE_NAME_MAP[language]} is coming soon!`}
        placement="top-start"
      >
        <span>{children}</span>
      </Tooltip>
    );
  };
