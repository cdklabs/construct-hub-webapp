import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchModal } from "./SearchModal";

describe("<SearchModal />", () => {
  const onClose = jest.fn();
  const onInputChange = jest.fn();
  const submodules = [{ name: "target-name", to: "target-location" }];

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  const renderPopover = () =>
    render(
      <SearchModal
        inputValue=""
        isOpen
        onClose={onClose}
        onInputChange={onInputChange}
        submodules={submodules}
      />
    );

  it("renders header, search, and submodules", () => {
    const { queryByTestId, queryByText } = renderPopover();
    expect(queryByText("target-name")).not.toBeNull();
    expect(queryByTestId("choose-submodule-modal-header")).not.toBeNull();
    expect(queryByTestId("choose-submodule-search-form")).not.toBeNull();
    expect(queryByTestId("choose-submodule-modal-results")).not.toBeNull();
  });

  it("fires onClose when exited", () => {
    const { getByTestId } = renderPopover();
    const closeBtn = getByTestId("choose-submodule-modal-close");
    userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates when a result is clicked", () => {
    const { getByTestId } = renderPopover();
    const result = getByTestId("choose-submodule-result");
    userEvent.click(result);
    expect(onClose).toHaveBeenCalled();
  });
});
