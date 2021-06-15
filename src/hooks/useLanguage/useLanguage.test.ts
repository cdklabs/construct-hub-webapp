import { renderHook } from "@testing-library/react-hooks";
import { useQueryParams as useQueryParamsMock } from "../../hooks/useQueryParams";
import { useLanguage } from "./useLanguage";

jest.mock("../../hooks/useQueryParams", () => ({
  useQueryParams: jest.fn(),
}));

const useQueryParams = useQueryParamsMock as jest.MockedFunction<
  typeof useQueryParamsMock
>;

describe("LanguageProvider", () => {
  const getItem = jest.spyOn(window.localStorage.__proto__, "getItem");

  afterEach(jest.clearAllMocks);

  const testRender = () => renderHook(() => useLanguage());

  it("sets value to valid language from query params", () => {
    useQueryParams.mockReturnValue(new URLSearchParams("l=golang"));
    const { result } = testRender();

    expect(result.current[0]).toEqual("golang");
  });

  it("ignores invalid language from query params", () => {
    useQueryParams.mockReturnValue(new URLSearchParams("l=ruby"));
    const { result } = testRender();

    expect(result.current[0]).toEqual("ts"); // The default language
  });

  it("checks localStorage for valid language if no url param value", () => {
    useQueryParams.mockReturnValue(new URLSearchParams(""));
    getItem.mockReturnValueOnce("dotnet");
    const { result } = testRender();

    expect(result.current[0]).toEqual("dotnet");
  });

  it("ignores invalid localStorage value", () => {
    useQueryParams.mockReturnValue(new URLSearchParams(""));
    getItem.mockReturnValueOnce("ruby");
    const { result } = testRender();

    expect(result.current[0]).toEqual("ts");
  });

  it("falls back to default lang if not localStorage or url param", () => {
    useQueryParams.mockReturnValue(new URLSearchParams(""));
    getItem.mockReturnValueOnce(null);
    const { result } = testRender();

    expect(result.current[0]).toEqual("ts");
  });
});
