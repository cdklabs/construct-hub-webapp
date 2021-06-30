import type { Story } from "@storybook/react";
import { useState } from "react";
import { Language } from "../../constants/languages";
import { CatalogSearch, CatalogSearchProps } from "./CatalogSearch";

export default {
  title: "Components / CatalogSearch",
  components: CatalogSearch,
  parameters: {
    actions: {
      argTypesRegex: /^on.*/,
    },
  },
};

export const Primary: Story<CatalogSearchProps> = (props) => {
  const [query, setQuery] = useState(props.query);
  const [language, setLanguage] = useState<Language | null>(null);

  const onLanguageChange = (lang: Language | null) => {
    setLanguage(lang);
    props.onLanguageChange?.(lang);
  };

  return (
    <CatalogSearch
      language={language}
      onLanguageChange={onLanguageChange}
      onQueryChange={(e) => {
        e.preventDefault();
        setQuery(e.target.value);
        props.onQueryChange?.(e);
      }}
      onSubmit={props.onSubmit}
      query={query}
    />
  );
};

Primary.args = {
  onSubmit: console.log,
  onLanguageChange: console.log,
  onQueryChange: console.log,
  query: "",
};
