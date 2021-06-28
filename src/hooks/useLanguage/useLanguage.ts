import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Language,
  Languages,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { useQueryParams } from "../../hooks/useQueryParams";

// Only supported language atm
const defaultLang: Language = Languages.TypeScript;

const LOCAL_KEY = "preferred-language";
const PARAM_KEY = "lang";

const isValidLang = (lang: Language | void) =>
  lang && TEMP_SUPPORTED_LANGUAGES.includes(lang);

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

export const useLanguage = (options: UseLanguageOptions = {}) => {
  const { updateUrl, updateSaved } = options;
  const { pathname, hash } = useLocation();
  const { replace } = useHistory();
  const params = useQueryParams();
  const langFromParams = params.get(PARAM_KEY) as Language;

  // Passed as function to guarantee it runs on hook mount
  const [language, setLanguage] = useState<Language>(() =>
    getInitialLang(langFromParams)
  );

  // State subscribes to query param changes
  useEffect(() => {
    if (isValidLang(langFromParams) && langFromParams !== language) {
      setLanguage(langFromParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFromParams]);

  // Syncs language changes to URL if updateUrl = true
  useEffect(() => {
    if (langFromParams !== language && updateUrl) {
      params.set(PARAM_KEY, language);
      replace({ pathname, hash, search: params.toString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, updateUrl]);

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

  return useMemo(() => [language, update] as const, [language, update]);
};
