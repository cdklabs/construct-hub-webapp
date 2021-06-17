import { render, cleanup, fireEvent } from "@testing-library/react";
import type { Language } from "../../constants/languages";
import { LanguageBar, LanguageBarProps } from "./index";

describe("<LanguageBar />", () => {
  afterEach(cleanup);

  function renderLanguageBar(props: Partial<LanguageBarProps>) {
    return render(
      <LanguageBar
        selectedLanguage="js"
        setSelectedLanguage={() => {}}
        targetLanguages={["js", "python"]}
        {...props}
      />
    );
  }

  test("showDisabled:false hides disabled languages", () => {
    const targetLanguages: Language[] = ["js", "python", "golang"];

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
      targetLanguages: ["js"],
      showDisabled: true,
    });

    const disabledElement = getByTestId("language-ts");
    expect(disabledElement).not.toBeNull();
    expect(disabledElement).toHaveAttribute("disabled");
  });

  test("selecting an element", () => {
    const selectElement = jest.fn();

    const { getByTestId } = renderLanguageBar({
      targetLanguages: ["js", "dotnet"],
      selectedLanguage: "js",
      setSelectedLanguage: selectElement,
    });

    fireEvent.click(getByTestId("language-dotnet"));

    expect(selectElement).toHaveBeenCalledWith("dotnet");
  });
});
