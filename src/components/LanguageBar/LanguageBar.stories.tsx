import { Box } from "@chakra-ui/react";
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
  const [selected, setSelected] = useState<Language>(Language.TypeScript);

  return (
    <Box mx="auto">
      <LanguageBar
        selectedLanguage={selected}
        setSelectedLanguage={setSelected}
        showDisabled={showDisabled}
        targetLanguages={targetLanguages}
      />
    </Box>
  );
};

export const Primary = Template.bind({});

Primary.args = {
  targetLanguages: [
    Language.TypeScript,
    Language.Python,
    Language.DotNet,
    Language.Go,
    Language.Java,
  ],
  showDisabled: true,
};
