import { Story } from "@storybook/react";
import { useState } from "react";
import {
  LanguageBar,
  Language,
  LanguageBarProps,
} from "../components/LanguageBar";

export default {
  title: "Language Bar",
  component: LanguageBar,
};

const Template: Story<LanguageBarProps> = ({
  showDisabled,
  targetLanguages,
}) => {
  const [selected, setSelected] = useState<Language>("ts");

  return (
    <LanguageBar
      selectedLanguage={selected}
      setSelectedLanguage={setSelected}
      showDisabled={showDisabled}
      targetLanguages={targetLanguages}
    />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  targetLanguages: ["ts", "dotnet", "golang", "java"],
  showDisabled: true,
};
