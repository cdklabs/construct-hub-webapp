import { renderHook } from "@testing-library/react-hooks";
import { useLocation as useLocationMock } from "react-router-dom";
import * as languageConstants from "../../constants/languages";
import { useLanguage } from "./useLanguage";

jest.mock("react-router-dom", () => ({
  useLocation: jest.fn(),
  useHistory: () => ({ replace: jest.fn() }),
}));

const useLocation = useLocationMock as jest.MockedFunction<
  typeof useLocationMock
>;

const baseLocation = {
  pathname: "/package/foo/v/1.0.1",
  hash: "",
  state: undefined,
  search: "",
};

describe("useLanguage", () => {
  const getItem = jest.spyOn(window.localStorage.__proto__, "getItem");

  beforeEach(() => {
    // @ts-ignore
    languageConstants.TEMP_SUPPORTED_LANGUAGES = languageConstants.LANGUAGES;
    useLocation.mockReturnValue(baseLocation);
  });

  afterEach(jest.clearAllMocks);

  const testRender = () => renderHook(() => useLanguage());

  it("sets value to valid language from query params", () => {
    useLocation.mockReturnValue({
      ...baseLocation,
      search: "lang=golang",
    });
    const { result } = testRender();

    expect(result.current[0]).toEqual("golang");
  });

  it("ignores invalid language from query params", () => {
    useLocation.mockReturnValue({
      ...baseLocation,
      search: "lang=ruby",
    });
    const { result } = testRender();

    expect(result.current[0]).toEqual("typescript"); // The default language
  });

  it("checks localStorage for valid language if no url param value", () => {
    getItem.mockReturnValueOnce("dotnet");
    const { result } = testRender();

    expect(result.current[0]).toEqual("dotnet");
  });

  it("ignores invalid localStorage value", () => {
    getItem.mockReturnValueOnce("ruby");
    const { result } = testRender();

    expect(result.current[0]).toEqual("typescript");
  });

  it("falls back to default lang if not localStorage or url param", () => {
    getItem.mockReturnValueOnce(null);
    const { result } = testRender();

    expect(result.current[0]).toEqual("typescript");
  });
});
