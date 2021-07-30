import { Packages } from "../../api/package/packages";
import { buildRedirectUrl } from "./index";

test("redirect to latest", () => {
  const catalog: Packages = {
    packages: [
      {
        author: {
          name: "authorName",
          url: "authorUrl",
        },
        description: "packageDescription",
        keywords: [],
        languages: {},
        metadata: {
          date: "publish date",
        },
        name: "my-package",
        version: "1.109.0",
      },
    ],
  };

  const url = buildRedirectUrl(catalog, "my-package");
  expect(url).toEqual("/packages/my-package/v/1.109.0");
});

test("throws if missing package", () => {
  const catalog: Packages = {
    packages: [
      {
        author: {
          name: "authorName",
          url: "authorUrl",
        },
        description: "packageDescription",
        keywords: [],
        languages: {},
        metadata: {
          date: "publish date",
        },
        name: "my-package",
        version: "1.109.0",
      },
    ],
  };

  expect(() => buildRedirectUrl(catalog, "missing-package")).toThrow();
});

test("selects latest major version if multiple versions", () => {
  const catalog: Packages = {
    packages: [
      {
        author: {
          name: "authorName",
          url: "authorUrl",
        },
        description: "packageDescription",
        keywords: [],
        languages: {},
        metadata: {
          date: "publish date",
        },
        name: "my-package",
        version: "1.109.0",
      },
      {
        author: {
          name: "authorName",
          url: "authorUrl",
        },
        description: "packageDescription",
        keywords: [],
        languages: {},
        metadata: {
          date: "publish date",
        },
        name: "my-package",
        version: "2.109.0",
      },
    ],
  };

  const url = buildRedirectUrl(catalog, "my-package");
  expect(url).toEqual("/packages/my-package/v/2.109.0");
});
