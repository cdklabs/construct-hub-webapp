import { render, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import copy from "copy-to-clipboard"; // Dependency of useClipboard;
import { CodePopover, CodePopoverProps, CodePopoverTrigger, testIds } from ".";

const defaultProps: CodePopoverProps = {
  header: "Code",
  code: "npm install @aws-cdk/core",
  trigger: <CodePopoverTrigger>Show</CodePopoverTrigger>,
};

jest.mock("copy-to-clipboard");

describe("<CodePopover />", () => {
  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  const Popover = (props: Partial<CodePopoverProps> = {}) => (
    <CodePopover {...defaultProps} {...props} />
  );

  const renderPopover = (props: Partial<CodePopoverProps> = {}) =>
    render(<Popover {...props} />);

  it("opens on trigger click", () => {
    const { getByTestId, queryByTestId } = renderPopover();
    expect(queryByTestId(testIds.header)).toBeNull();

    userEvent.click(getByTestId(testIds.trigger));
    expect(getByTestId(testIds.header)).not.toBeNull();
  });

  it("closes on close click", () => {
    const { getByTestId, queryByTestId } = renderPopover();
    userEvent.click(getByTestId(testIds.trigger));
    expect(getByTestId(testIds.header)).not.toBeNull();

    userEvent.click(getByTestId(testIds.close));
    expect(queryByTestId(testIds.header)).toBeNull();
  });

  it("copies the code on copy click", async () => {
    const { getByTestId } = renderPopover();

    userEvent.click(getByTestId(testIds.trigger));
    userEvent.click(getByTestId(testIds.copy));

    expect(copy).toHaveBeenCalledWith(defaultProps.code, {});
  });
});
