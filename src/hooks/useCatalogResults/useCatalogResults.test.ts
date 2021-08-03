import { renderHook, cleanup } from "@testing-library/react-hooks";
import catalog from "../../__fixtures__/catalog.json";
import { Packages } from "../../api/package/packages";
import { Language } from "../../constants/languages";
import { useCatalog } from "../../contexts/Catalog";
import {
  useCatalogResults,
  UseCatalogResultsOptions,
} from "./useCatalogResults";

const catalogFixture = catalog as Packages;

const defaultOptions: UseCatalogResultsOptions = {
  offset: 0,
  limit: 25,
  query: "",
  language: null,
};

jest.mock("../../contexts/Catalog", () => ({
  useCatalog: jest.fn(),
}));

const useCatalogMock = useCatalog as jest.MockedFunction<typeof useCatalog>;

describe("useCatalogResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCatalogMock.mockReturnValue(catalogFixture);
  });

  afterEach(cleanup);

  const renderUseCatalog = (options: UseCatalogResultsOptions) =>
    renderHook(() => useCatalogResults(options));

  it("returns pageLimit, results, displayable state", () => {
    const { result } = renderUseCatalog(defaultOptions);
    const { pageLimit, results, displayable } = result.current;

    expect(typeof pageLimit).toBe("number");
    expect(typeof results).toBe("object");
    expect(typeof displayable).toBe("object");
  });

  it("filters results by query", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      query: "@aws-cdk/aws-iot",
    });

    expect(result.current.results).toEqual(
      catalogFixture.packages.filter((item) =>
        item.name.includes("@aws-cdk/aws-iot")
      )
    );
  });

  it("filters results by language", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      language: Language.DotNet,
    });

    expect(result.current.results).toEqual(
      catalogFixture.packages.filter(({ languages }) =>
        Object.keys(languages).includes(Language.DotNet)
      )
    );
  });

  it("filters displayable limit", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      limit: 50,
    });

    expect(result.current.displayable).toEqual(
      catalogFixture.packages.slice(0, 50)
    );
  });

  it("filters displayable offset", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      limit: 25,
      offset: 3,
    });

    expect(result.current.displayable).toEqual(
      catalogFixture.packages.slice(75, 100)
    );
  });
});
