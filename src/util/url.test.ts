import { Language } from "../constants/languages";
import { QUERY_PARAMS, ROUTES } from "../constants/url";
import {
  getRepoUrlAndHost,
  createURLSearchParams,
  createURL,
  getSearchPath,
  __getPackagePath,
} from "./url";

describe("getRepoUrlAndHost", () => {
  it("returns hostname and url for non-ssh urls", () => {
    const result = getRepoUrlAndHost("https://example.com")!;
    expect(result.hostname).toEqual("example.com");
    expect(result.url).toEqual("https://example.com");
  });

  it("returns hostname and url for git ssh urls", () => {
    const result = getRepoUrlAndHost("git@github.com:foo/bar")!;
    expect(result.hostname).toEqual("github.com");
    expect(result.url).toEqual("https://github.com/foo/bar");
  });

  it("returns undefined for invalid urls", () => {
    [
      "://github.com/foo/bar",
      "git@github.com/foo/bar",
      "github/foo/bar",
    ].forEach((url) => {
      expect(getRepoUrlAndHost(url)).toBeUndefined();
    });
  });
});

describe("createUrlSearchParams", () => {
  it("applies params correctly and filters out nullish params", () => {
    const result = createURLSearchParams({
      a: "foo",
      b: 1,
      c: null,
      d: undefined,
    });

    expect(result).toEqual("a=foo&b=1");
  });

  it("applies params to a base string", () => {
    const result = createURLSearchParams(
      {
        baz: "omg",
      },
      "?foo=bar"
    );

    expect(result).toEqual("foo=bar&baz=omg");
  });
});

describe("createUrl", () => {
  it("creates a url with no params", () => {
    const result = createURL("/foo", {
      bar: undefined,
    });

    expect(result).toEqual("/foo");
  });
});

describe("getSearchPath", () => {
  it("creates a valid search url", () => {
    const result = getSearchPath({
      offset: 1,
      language: Language.Python,
      query: "@aws/cdk",
    });

    expect(result).toEqual(
      `${ROUTES.SEARCH}?${QUERY_PARAMS.SEARCH_QUERY}=%40aws%2Fcdk&${QUERY_PARAMS.LANGUAGE}=${Language.Python}&${QUERY_PARAMS.OFFSET}=1`
    );
  });
});

describe("getPackagePath", () => {
  it("creates a valid package url", () => {
    const pkg = {
      name: "@example/construct",
      version: "1.0.0",
      submodule: "foo",
      language: Language.Go,
    };

    const result = __getPackagePath(pkg);

    expect(result).toEqual(
      `${ROUTES.PACKAGES}/${pkg.name}/v/${pkg.version}?${QUERY_PARAMS.SUBMODULE}=${pkg.submodule}&${QUERY_PARAMS.LANGUAGE}=${pkg.language}`
    );
  });
});
