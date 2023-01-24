import {
  getRepoUrlAndHost,
  createURLSearchParams,
  createURL,
  getSearchPath,
  getPackagePath,
} from "./url";
import { CatalogSearchSort } from "../api/catalog-search/constants";
import { CDKType } from "../constants/constructs";
import { Language } from "../constants/languages";

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
      cdkMajor: 1,
      offset: 1,
      query: "@aws/cdk",
      cdkType: CDKType.awscdk,
      languages: [Language.DotNet, Language.Go],
      sort: CatalogSearchSort.PublishDateDesc,
    });

    expect(result).toMatchInlineSnapshot(
      `"/search?q=%40aws%2Fcdk&cdk=aws-cdk&cdkver=1&langs=dotnet%2Cgo&sort=newest&offset=1"`
    );
  });
});

describe("getPackagePath", () => {
  it("creates a valid package url", () => {
    const basePkg = {
      name: "@example/construct",
    };

    const basePath = getPackagePath(basePkg);

    expect(basePath).toMatchInlineSnapshot(`"/packages/@example/construct"`);

    const pathWithVersion = getPackagePath({ ...basePkg, version: "1.0.0" });

    expect(pathWithVersion).toMatchInlineSnapshot(
      `"/packages/@example/construct/v/1.0.0"`
    );

    const pathWithSubmodule = getPackagePath({
      ...basePkg,
      version: "1.0.0",
      submodule: "foo",
    });

    expect(pathWithSubmodule).toMatchInlineSnapshot(
      `"/packages/@example/construct/v/1.0.0?submodule=foo"`
    );

    const pathWithLanguage = getPackagePath({
      ...basePkg,
      version: "1.0.0",
      language: Language.Go,
    });

    expect(pathWithLanguage).toMatchInlineSnapshot(
      `"/packages/@example/construct/v/1.0.0?lang=go"`
    );

    const pathWithApiRef = getPackagePath({
      ...basePkg,
      version: "1.0.0",
      api: "bar",
    });

    expect(pathWithApiRef).toMatchInlineSnapshot(
      `"/packages/@example/construct/v/1.0.0/api/bar"`
    );

    const pathWithAllParams = getPackagePath({
      ...basePkg,
      version: "1.0.0",
      submodule: "foo",
      api: "bar",
      language: Language.Go,
    });

    expect(pathWithAllParams).toMatchInlineSnapshot(
      `"/packages/@example/construct/v/1.0.0/api/bar?submodule=foo&lang=go"`
    );
  });
});
