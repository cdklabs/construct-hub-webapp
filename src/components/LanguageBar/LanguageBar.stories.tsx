import { Story } from "@storybook/react";
import { useState } from "react";
import { Language } from "../../constants/languages";
import { LanguageBar, LanguageBarProps } from "./LanguageBar";

export default {
  title: "Components / Language Bar",
  component: LanguageBar,
};

const Template: Story<LanguageBarProps> = ({
  showDisabled,
  targetLanguages,
}) => {
  const [selected, setSelected] = useState<Language>("typescript");

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
  targetLanguages: ["typescript", "dotnet", "golang", "java"],
  showDisabled: true,
};
