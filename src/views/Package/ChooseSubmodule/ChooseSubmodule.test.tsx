import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ChooseSubmodule } from "./ChooseSubmodule";
import { PackageStateProvider } from "../PackageState";

// Mock the SearchModal to capture the submodules prop
jest.mock("./SearchModal", () => ({
  SearchModal: ({
    submodules,
  }: {
    submodules: Array<{ name: string; to: string }>;
  }) => (
    <div data-testid="search-modal">
      {submodules.map((sub) => (
        <div
          data-testid={`submodule-${sub.name}`}
          data-url={sub.to}
          key={sub.name}
        >
          {sub.name}
        </div>
      ))}
    </div>
  ),
}));

// Mock the hooks and components
jest.mock("../PackageState", () => ({
  usePackageState: () => ({
    assembly: {
      data: {
        submodules: {
          "aws-cdk-lib.interfaces.aws_cloudformation": {},
          "aws-cdk-lib.interfaces.aws_s3": {},
          "aws-cdk-lib.aws_lambda": {},
          "aws-cdk-lib.aws_ec2": {},
        },
      },
    },
    name: "aws-cdk-lib",
    language: "typescript",
    scope: undefined,
    version: "2.0.0",
  }),
  PackageStateProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("../../../hooks/useQueryParams", () => ({
  useQueryParams: () => ({
    get: () => null,
  }),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

describe("ChooseSubmodule", () => {
  it("should render without errors", () => {
    const TestWrapper = () => (
      <BrowserRouter>
        <PackageStateProvider>
          <ChooseSubmodule />
        </PackageStateProvider>
      </BrowserRouter>
    );

    const { container } = render(<TestWrapper />);
    expect(container).toBeInTheDocument();
  });

  it("should display correct submodule names in the UI", () => {
    const TestWrapper = () => (
      <BrowserRouter>
        <PackageStateProvider>
          <ChooseSubmodule />
        </PackageStateProvider>
      </BrowserRouter>
    );

    render(<TestWrapper />);

    // Click to open the modal
    fireEvent.click(screen.getByTestId("choose-submodule-search-trigger"));

    // Verify the expected submodule names are displayed with correct content
    expect(
      screen.getByText("interfaces.aws_cloudformation")
    ).toBeInTheDocument();
    expect(screen.getByText("interfaces.aws_s3")).toBeInTheDocument();
    expect(screen.getByText("aws_lambda")).toBeInTheDocument();
    expect(screen.getByText("aws_ec2")).toBeInTheDocument();
  });
});
