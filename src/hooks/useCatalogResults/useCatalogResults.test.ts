import { renderHook, cleanup } from "@testing-library/react-hooks";
import catalog from "../../__fixtures__/catalog.json";
import { CatalogPackage, Packages } from "../../api/package/packages";
import { Language } from "../../constants/languages";
import { useCatalog } from "../../contexts/Catalog";
import {
  useCatalogResults,
  UseCatalogResultsOptions,
} from "./useCatalogResults";

const catalogFixture = catalog as Packages;

const sortFn = (p1: CatalogPackage, p2: CatalogPackage) => {
  const d1 = new Date(p1.metadata.date);
  const d2 = new Date(p2.metadata.date);
  if (d1 === d2) {
    return 0;
  }
  return d1 < d2 ? 1 : -1;
};

const defaultOptions: UseCatalogResultsOptions = {
  offset: 0,
  limit: 25,
  query: "",
  language: null,
};

const defaultCatalogContext = {
  loading: false,
  error: undefined,
  data: catalogFixture,
};

jest.mock("../../contexts/Catalog", () => ({
  useCatalog: jest.fn(),
}));

const useCatalogMock = useCatalog as jest.MockedFunction<typeof useCatalog>;

describe("useCatalogResults", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useCatalogMock.mockReturnValue(defaultCatalogContext);
  });

  afterEach(cleanup);

  const renderUseCatalog = (options: UseCatalogResultsOptions) =>
    renderHook(() => useCatalogResults(options));

  it("returns pageLimit, results, displayable, loadind, and error state", () => {
    const { result } = renderUseCatalog(defaultOptions);
    const { loading, error, pageLimit, results, displayable } = result.current;

    expect(typeof loading).toBe("boolean");
    expect(error).toBeUndefined();
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
      catalogFixture.packages
        .filter(({ languages }) =>
          Object.keys(languages).includes(Language.DotNet)
        )
        .sort(sortFn)
    );
  });

  it("returns empty results if catalog data is loading, errored, or undefined", () => {
    useCatalogMock.mockReturnValue({
      ...defaultCatalogContext,
      loading: true,
    });

    const { result, rerender } = renderUseCatalog(defaultOptions);

    expect(result.current.loading).toEqual(true);
    expect(result.current.results).toEqual([]);

    const error = new Error("Test error");

    useCatalogMock.mockReturnValue({
      ...defaultCatalogContext,
      error,
    });

    rerender(defaultOptions);

    expect(result.current.error).toEqual(error);
    expect(result.current.results).toEqual([]);

    useCatalogMock.mockReturnValue({
      ...defaultCatalogContext,
      data: undefined,
    });

    expect(result.current.results).toEqual([]);
  });

  it("filters displayable limit", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      limit: 50,
    });

    expect(result.current.displayable).toEqual(
      catalogFixture.packages.sort(sortFn).slice(0, 50)
    );
  });

  it("filters displayable offset", () => {
    const { result } = renderUseCatalog({
      ...defaultOptions,
      limit: 25,
      offset: 3,
    });

    expect(result.current.displayable).toEqual(
      catalogFixture.packages.sort(sortFn).slice(75, 100)
    );
  });
});
