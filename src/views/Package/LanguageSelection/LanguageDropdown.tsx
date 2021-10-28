import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuItem, MenuList, MenuButton } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import {
  Language,
  LANGUAGES,
  LANGUAGE_RENDER_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../../constants/languages";

interface LanguageDropdownProps {
  selectedLanguage: Language;
  setSelectedLanguage: (val: Language) => void;
  targetLanguages: Language[];
}

const LanguageItem: FunctionComponent<{
  language: Language;
  onClick: () => void;
}> = ({ language, onClick }) => {
  const { name, icon: Icon } = LANGUAGE_RENDER_MAP?.[language] ?? {}; // Should never be undefined

  return (
    <MenuItem
      icon={<Icon />}
      isDisabled={!TEMP_SUPPORTED_LANGUAGES.has(language)}
      onClick={onClick}
    >
      {name}
    </MenuItem>
  );
};

export const LanguageDropdown: FunctionComponent<LanguageDropdownProps> = ({
  selectedLanguage,
  setSelectedLanguage,
  targetLanguages,
}) => {
  const { name, icon: Icon } = LANGUAGE_RENDER_MAP?.[selectedLanguage] ?? {}; // Should never be undefined

  const getOnClick = (lang: Language) => () => {
    if (lang === selectedLanguage) return;
    setSelectedLanguage(lang);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        color="blue.500"
        fontSize=".75rem"
        leftIcon={<ChevronDownIcon />}
        mt={2}
        rightIcon={<Icon />}
        size="md"
        variant="link"
      >
        {name}
      </MenuButton>
      <MenuList>
        {[...targetLanguages]
          .sort(
            (left, right) => LANGUAGES.indexOf(left) - LANGUAGES.indexOf(right)
          )
          .map((lang) => (
            <LanguageItem
              key={lang}
              language={lang}
              onClick={getOnClick(lang)}
            />
          ))}
      </MenuList>
    </Menu>
  );
};
