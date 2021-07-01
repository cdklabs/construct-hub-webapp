import { getAssetsPath } from "./util";

describe("getAssetsUrl", () => {
  const scope = "PACKAGE_SCOPE";
  const name = "PACKAGE_NAME";
  const version = "PACKAGE_VERSION";

  test("excludes scope when undefined", () => {
    const subject = getAssetsPath(name, version);
    expect(subject).toEqual("/data/PACKAGE_NAME/vPACKAGE_VERSION");
  });

  test("includes scope when defined", () => {
    const subject = getAssetsPath(name, version, scope);
    expect(subject).toEqual(
      "/data/PACKAGE_SCOPE/PACKAGE_NAME/vPACKAGE_VERSION"
    );
  });
});
