import {
  createContext,
  ReactChild,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Language, Languages, LANGUAGES } from "../../constants/languages";
import { useQueryParams } from "../../hooks/useQueryParams";

const defaultLang: Language = Languages.TypeScript;

const LOCAL_KEY = "preferred-language";
const PARAM_KEY = "l";

const isValidLang = (lang: Language | null) => lang && LANGUAGES.includes(lang);

export const LanguageContext = createContext<
  [Language, (language: Language) => void]
>([defaultLang, () => {}]);

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactChild }) {
  const langFromParams = useQueryParams().get(PARAM_KEY) as Language | null;

  const [language, setLanguage] = useState<Language>(() => {
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
  });

  // Update the language without persisting if a user navigates to a url with a language query param
  useEffect(() => {
    if (isValidLang(langFromParams) && langFromParams !== language) {
      setLanguage(langFromParams as Language);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langFromParams]);

  // A wrapper around setLanguage to persist language when a user manually sets it.
  const update = useCallback(
    (val: Language) => {
      setLanguage(val);
      try {
        localStorage.setItem(LOCAL_KEY, val);
      } catch {
        // OK to fail silently
      }
    },
    [setLanguage]
  );

  return (
    <LanguageContext.Provider value={[language, update]}>
      {children}
    </LanguageContext.Provider>
  );
}
