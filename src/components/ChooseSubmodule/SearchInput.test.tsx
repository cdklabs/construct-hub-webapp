import { act, render, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchInput } from "./SearchInput";

describe("<SearchInput />", () => {
  const onChange = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(jest.clearAllMocks);

  afterEach(cleanup);

  const renderInput = (initialVal = "") =>
    render(
      <SearchInput onChange={onChange} onSubmit={onSubmit} value={initialVal} />
    );

  it("Renders with an initial value", () => {
    const { getByTestId } = renderInput("Some value");
    expect(getByTestId("choose-submodule-search-input")).toHaveAttribute(
      "value",
      "Some value"
    );
  });

  it("Fires onSubmit from props", () => {
    const { getByTestId } = renderInput();
    const form = getByTestId("choose-submodule-search-form");
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("Debounces onChange until user stops typing", async () => {
    const targetValue = "@aws-cdk/core";
    const { getByTestId } = renderInput();
    const input = getByTestId("choose-submodule-search-input");

    await act(async () => {
      // This will resolve after the full string is typed with a 50ms delay between keystrokes
      await userEvent.type(input, targetValue, { delay: 50 });
      // wait for debounced update to fire
      await new Promise((res) => setTimeout(res, 500));
    });

    expect(onChange).toHaveBeenNthCalledWith(1, targetValue);
  });
});
