import { useMediaQuery, useToken } from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { LanguageBar } from "../../../components/LanguageBar";
import { Language, LANGUAGES } from "../../../constants/languages";
import { useLanguage } from "../../../hooks/useLanguage";
import { usePackageState } from "../PackageState";
import { LanguageDropdown } from "./LanguageDropdown";

const languageSet = new Set(LANGUAGES);

export const LanguageSelection: FunctionComponent = () => {
  const state = usePackageState();
  const assembly = state.assembly.data;
  const language = state.language;

  const mdBreakpoint = useToken("breakpoints", "md");
  const [isMd] = useMediaQuery(`(min-width: ${mdBreakpoint})`);

  const [, setLanguage] = useLanguage({
    updateSaved: true,
    updateUrl: true,
  });

  const [, changeLanguage] = useLanguage({ updateUrl: true });

  const targets = [
    ...Object.keys(assembly?.targets ?? {}),
    // typescript is the source language and hence always supported.
    // (it doesn't appear in spec.targets)
    Language.TypeScript,
  ] as Language[];

  const selectedIsValid = targets.includes(language);

  useEffect(() => {
    if (!selectedIsValid) {
      changeLanguage(Language.TypeScript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIsValid]);

  const props = {
    selectedLanguage: selectedIsValid ? language : Language.TypeScript,
    setSelectedLanguage: setLanguage,
    targetLanguages: targets.filter((target) => languageSet.has(target)),
  };

  return isMd ? <LanguageDropdown {...props} /> : <LanguageBar {...props} />;
};
