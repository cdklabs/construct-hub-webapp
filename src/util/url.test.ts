import { getRepoUrlAndHost } from "./url";

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
