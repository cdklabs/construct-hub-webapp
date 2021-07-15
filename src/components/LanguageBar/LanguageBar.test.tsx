import { render, cleanup, fireEvent } from "@testing-library/react";
import { Language } from "../../constants/languages";
import { LanguageBar, LanguageBarProps } from "./LanguageBar";

describe("<LanguageBar />", () => {
  afterEach(cleanup);

  const renderLanguageBar = (props: Partial<LanguageBarProps>) => {
    return render(
      <LanguageBar
        selectedLanguage={Language.TypeScript}
        setSelectedLanguage={() => {}}
        targetLanguages={[Language.TypeScript, Language.Python]}
        {...props}
      />
    );
  };

  test("showDisabled:false hides disabled languages", () => {
    const targetLanguages: Language[] = [
      Language.TypeScript,
      Language.Python,
      Language.Go,
    ];

    const { getByTestId, queryByTestId } = renderLanguageBar({
      targetLanguages,
      showDisabled: false,
    });

    targetLanguages.forEach((language) => {
      expect(getByTestId(`language-${language}`)).not.toBeNull();
    });

    expect(queryByTestId("language-ts")).toBeNull();
  });

  test("showDisabled:true shows disabled languages", () => {
    const { getByTestId } = renderLanguageBar({
      targetLanguages: [Language.Python],
      showDisabled: true,
    });

    const disabledElement = getByTestId("language-typescript");
    expect(disabledElement).not.toBeNull();
    expect(disabledElement).toHaveAttribute("disabled");
  });

  test("selecting an element", () => {
    const selectElement = jest.fn();

    const { getByTestId } = renderLanguageBar({
      targetLanguages: [Language.TypeScript, Language.DotNet],
      selectedLanguage: Language.TypeScript,
      setSelectedLanguage: selectElement,
    });

    fireEvent.click(getByTestId("language-dotnet"));

    expect(selectElement).toHaveBeenCalledWith("dotnet");
  });
});
