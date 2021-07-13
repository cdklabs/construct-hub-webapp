import type { Assembly } from "@jsii/spec";
import { act, cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { ChooseSubmodule } from "./ChooseSubmodule";

// Necessary data shape for <ChooseSubmodule />
const assembly: Assembly = {
  submodules: {
    "aws-cdk-lib.aws_eks": {},
    "aws-cdk-lib.cx_api": {},
  },
} as any;

describe("<ChooseSubmodule />", () => {
  let history: ReturnType<typeof createMemoryHistory>;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  afterEach(cleanup);

  const renderComponent = (asm = assembly) =>
    render(<ChooseSubmodule assembly={asm} />, {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => <Router history={history} {...props} />,
    });

  it("opens the search popover on button click", () => {
    const { getByTestId, queryByTestId } = renderComponent();

    // Verify it's closed
    expect(queryByTestId("choose-submodule-search-form")).toBeNull();
    // Now open it & check for it's presence
    userEvent.click(getByTestId("choose-submodule-search-trigger"));
    expect(queryByTestId("choose-submodule-search-form")).not.toBeNull();
  });

  it("only displays back button when a submodule is present", () => {
    let { queryByTestId } = renderComponent();
    expect(queryByTestId("choose-submodule-go-back")).toBeNull();

    history = createMemoryHistory({
      initialEntries: ["/?submodule=aws_eks"],
    });

    ({ queryByTestId } = renderComponent());
    expect(queryByTestId("choose-submodule-go-back")).not.toBeNull();
  });

  it("navigates to correct path on back button click", () => {
    history = createMemoryHistory({
      initialEntries: ["/?submodule=aws_eks"],
    });

    const { getByTestId } = renderComponent();
    userEvent.click(getByTestId("choose-submodule-go-back"));
    expect(window.location.search).toEqual("");
  });

  it("shows all submodules when no filter", () => {
    const { getByTestId, queryAllByTestId } = renderComponent();

    userEvent.click(getByTestId("choose-submodule-search-trigger"));

    expect(queryAllByTestId("choose-submodule-result").length).toEqual(
      Object.keys(assembly.submodules ?? {}).length
    );
  });

  it("only shows filtered submodules", async () => {
    const { getByTestId, queryAllByTestId } = renderComponent();

    userEvent.click(getByTestId("choose-submodule-search-trigger"));
    userEvent.type(getByTestId("choose-submodule-search-input"), "cx_api");

    await act(async () => {
      // Wait for search debounce
      await new Promise((res) => setTimeout(res, 500));
    });

    expect(queryAllByTestId("choose-submodule-result").length).toEqual(1);
  });

  it("submodules link to correct path", () => {
    const { getByTestId, queryAllByTestId } = renderComponent();

    userEvent.click(getByTestId("choose-submodule-search-trigger"));
    userEvent.click(queryAllByTestId("choose-submodule-result")[0]);

    expect(decodeURIComponent(history.location.search)).toEqual(
      "?submodule=aws_eks"
    );
  });
});
