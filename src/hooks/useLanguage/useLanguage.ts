import { useCallback, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Language, Languages, LANGUAGES } from "../../constants/languages";
import { useQueryParams } from "../../hooks/useQueryParams";

const defaultLang: Language = Languages.TypeScript;

const LOCAL_KEY = "preferred-language";
const PARAM_KEY = "lang";

const isValidLang = (lang: Language | void) => lang && LANGUAGES.includes(lang);

const getInitialLang = (langFromParams: Language): Language => {
  // First, use language from query params in url
  if (isValidLang(langFromParams)) {
    return langFromParams as Language;
  }

  // Next check for one stored in localStorage
  try {
    const storedLang = (localStorage.getItem(LOCAL_KEY) ?? "") as Language;
    if (isValidLang(storedLang)) return storedLang;
  } catch {
    // Do nothing, we just don't want to crash if localStorage access is blocked.
  }

  // Otherwise fallback to a default
  return defaultLang;
};

export interface UseLanguageOptions {
  /**
   * Syncs the preferred language to a query param in URL
   */
  updateUrl?: boolean;
  /**
   * Saves the selected language to localStorage on select
   */
  updateSaved?: boolean;
}

export function useLanguage(options: UseLanguageOptions = {}) {
  const { updateUrl, updateSaved } = options;
  const { pathname, hash } = useLocation();
  const { replace } = useHistory();
  const params = useQueryParams();
  const langFromParams = params.get(PARAM_KEY) as Language;

  // Passed as function to guarantee it runs on hook mount
  const [language, setLanguage] = useState<Language>(() =>
    getInitialLang(langFromParams)
  );

  // A wrapper around setLanguage to persist language when a user manually sets it.
  const update = useCallback(
    (val: Language) => {
      setLanguage(val);

      if (updateSaved) {
        try {
          localStorage.setItem(LOCAL_KEY, val);
        } catch {
          // OK to fail silently
        }
      }
    },
    [updateSaved]
  );

  useEffect(() => {
    if (updateUrl && language !== langFromParams) {
      params.set(PARAM_KEY, language);
      replace({ pathname, search: params.toString(), hash });
    }
    // We only want this effect to run when language or updateUrl changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, updateUrl]);

  return [language, update] as const;
}
