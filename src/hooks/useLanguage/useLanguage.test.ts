import { renderHook } from "@testing-library/react-hooks";
import * as languageConstants from "../../constants/languages";
import { useLanguage } from "./useLanguage";

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({ query: {} })),
}));

describe("useLanguage", () => {
  const getItem = jest.spyOn(window.localStorage.__proto__, "getItem");

  beforeEach(() => {
    // @ts-ignore
    languageConstants.TEMP_SUPPORTED_LANGUAGES = new Set(
      languageConstants.LANGUAGES
    );
  });

  afterEach(jest.clearAllMocks);

  const testRender = () => renderHook(() => useLanguage());

  it("checks localStorage for valid language if no url param value", () => {
    getItem.mockReturnValueOnce("dotnet");
    const { result } = testRender();

    expect(result.current[0]).toEqual(languageConstants.Language.DotNet);
  });

  it("ignores invalid localStorage value", () => {
    getItem.mockReturnValueOnce("ruby");
    const { result } = testRender();

    expect(result.current[0]).toEqual(languageConstants.Language.TypeScript);
  });

  it("falls back to default lang if not localStorage or url param", () => {
    getItem.mockReturnValueOnce(null);
    const { result } = testRender();

    expect(result.current[0]).toEqual(languageConstants.Language.TypeScript);
  });
});
