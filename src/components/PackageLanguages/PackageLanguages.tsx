import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { getPackagePath } from "../../util/url";
import { LanguageSupportTooltip } from "../LanguageSupportTooltip";

const sizes = {
  sm: 5,
  md: 6,
  lg: 8,
};

export interface PackageLanguagesProps {
  isRounded?: boolean;
  languages: Partial<Record<Language, unknown>>;
  name: string;
  size?: "sm" | "md" | "lg";
  version: string;
}

export const PackageLanguages: FunctionComponent<PackageLanguagesProps> = ({
  isRounded = false,
  languages,
  name: packageName,
  size = "md",
  version,
}) => {
  const targets = Object.keys(languages ?? {}) as Language[];
  return (
    <>
      {Object.entries(LANGUAGE_RENDER_MAP)
        // Ensure entries are always sorted in a stable way
        .sort(
          ([left], [right]) =>
            LANGUAGES.indexOf(left as Language) -
            LANGUAGES.indexOf(right as Language)
        )
        .map(([lang, info]) => {
          const language = lang as Language;

          const isSupportedByLibrary =
            language === Language.TypeScript || targets.includes(language);

          const isSupportedByConstructHub =
            language === Language.TypeScript || // TypeScript is always supported
            // Otherwise, the language must be supported by ConstructHub
            TEMP_SUPPORTED_LANGUAGES.has(language);

          if (!isSupportedByLibrary) return null;

          const { name, icon: Icon } = info;

          const icon = (
            <Icon
              aria-label={`Supports ${name}`}
              borderRadius={isRounded ? "50%" : 0}
              h={sizes[size]}
              opacity={isSupportedByConstructHub ? 1 : 0.2}
              w={sizes[size]}
            />
          );

          return (
            <LanguageSupportTooltip key={language} language={language}>
              {isSupportedByConstructHub ? (
                <Link
                  aria-label={`View package docs for ${language}`}
                  to={getPackagePath({ name: packageName, version, language })}
                >
                  {icon}
                </Link>
              ) : (
                icon
              )}
            </LanguageSupportTooltip>
          );
        })}
    </>
  );
};
