import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CatalogSearch, CatalogSearchProps } from "./CatalogSearch";
import { testIds } from "./constants";

describe("<CatalogSearch />", () => {
  const onSubmit = jest.fn();

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  const Component = () => {
    const [query, setQuery] = useState("");
    const [language, setLanguage] =
      useState<CatalogSearchProps["language"]>(null);

    return (
      <CatalogSearch
        language={language}
        onLanguageChange={setLanguage}
        onQueryChange={(e) => setQuery(e.target.value)}
        onSubmit={onSubmit}
        query={query}
      />
    );
  };

  const renderComponent = () => render(<Component />);

  it("renders search input, language filter, and submit button", () => {
    const { getByTestId } = renderComponent();
    [testIds.input, testIds.languageDropdown, testIds.submit].forEach(
      (selector) => {
        expect(getByTestId(selector)).not.toBeNull();
      }
    );
  });

  it("reflects user input", () => {
    const { getByTestId } = renderComponent();
    const input = getByTestId(testIds.input);
    userEvent.type(input, "@aws-cdk");
    expect(input).toHaveAttribute("value", "@aws-cdk");
  });

  it("reflects changes to language dropdown", () => {
    const { getByTestId, getAllByTestId } = renderComponent();
    const dropdown = getByTestId(testIds.languageDropdown);
    userEvent.click(dropdown);
    const options = getAllByTestId(testIds.languageItem);

    // Programatically select each option and assert on the expected value
    options.forEach((option, index) => {
      const isFirst = index === 0;

      if (!isFirst) {
        // Re-open the menu for subsequent items
        userEvent.click(dropdown);
      }

      userEvent.click(option);

      expect(getByTestId(testIds.languageDropdownValue).innerHTML).toEqual(
        isFirst ? "Language..." : option.innerHTML
      );
    });
  });

  it("Calls onSubmit", () => {
    const { getByTestId, getByText } = renderComponent();
    const queryInput = getByTestId(testIds.input);
    const dropdown = getByTestId(testIds.languageDropdown);
    const submit = getByTestId(testIds.submit);

    const input = {
      query: "@aws-cdk",
      language: "Any",
    };

    userEvent.type(queryInput, input.query);
    userEvent.click(dropdown);
    userEvent.click(getByText(input.language));
    userEvent.click(submit);
    expect(onSubmit).toHaveBeenCalled();
  });
});
