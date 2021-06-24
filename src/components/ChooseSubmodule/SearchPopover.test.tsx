import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { SearchPopover } from "./SearchPopover";

describe("<SearchPopover />", () => {
  const history = createMemoryHistory();
  const onClose = jest.fn();
  const onInputChange = jest.fn();
  const submodules = [{ name: "target-name", to: "target-location" }];

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  const renderPopover = () =>
    render(
      <SearchPopover
        inputValue=""
        isOpen
        onClose={onClose}
        onInputChange={onInputChange}
        submodules={submodules}
        trigger={<button />}
      />,
      {
        // eslint-disable-next-line react/display-name
        wrapper: (props) => <Router history={history} {...props} />,
      }
    );

  it("renders header, search, and submodules", () => {
    const { queryByTestId, queryByText } = renderPopover();
    expect(queryByText("target-name")).not.toBeNull();
    expect(queryByTestId("choose-submodule-popover-header")).not.toBeNull();
    expect(queryByTestId("choose-submodule-search-form")).not.toBeNull();
    expect(queryByTestId("choose-submodule-popover-results")).not.toBeNull();
  });

  it("fires onClose when exited", () => {
    const { getByTestId } = renderPopover();
    const closeBtn = getByTestId("choose-submodule-popover-close");
    userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates when a result is clicked", () => {
    const { getByTestId } = renderPopover();
    const result = getByTestId("choose-submodule-result");
    userEvent.click(result);
    expect(history.location.pathname).toEqual("/target-location");
    expect(onClose).toHaveBeenCalled();
  });
});
