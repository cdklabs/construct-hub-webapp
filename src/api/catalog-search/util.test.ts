import catalogFixture from "../../__fixtures__/catalog.json";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { CatalogSearchSort } from "./constants";
import { SORT_FUNCTIONS, FILTER_FUNCTIONS } from "./util";

const packages = catalogFixture.packages as CatalogPackage[];

describe("Catalog Search Utils", () => {
  describe("Sort Functions", () => {
    it("Sorts by Publish Date", () => {
      const resultsAscending = [...packages].sort(
        SORT_FUNCTIONS[CatalogSearchSort.PublishDateAsc]
      );
      const resultsDescending = [...packages].sort(
        SORT_FUNCTIONS[CatalogSearchSort.PublishDateDesc]
      );

      expect(
        resultsAscending.map(({ name, metadata: { date } }) => ({ name, date }))
      ).toMatchSnapshot();

      resultsAscending.forEach((res, idx) => {
        expect(res.metadata.date).toEqual(
          resultsDescending[resultsDescending.length - 1 - idx].metadata.date
        );
      });
    });

    it("Sorts by Package Name", () => {
      const resultsAscending = [...packages].sort(
        SORT_FUNCTIONS[CatalogSearchSort.NameAsc]
      );
      const resultsDescending = [...packages].sort(
        SORT_FUNCTIONS[CatalogSearchSort.NameDesc]
      );

      expect(resultsAscending.map(({ name }) => ({ name }))).toMatchSnapshot();

      expect(
        resultsAscending.map(({ name, metadata: { date } }) => ({ name, date }))
      ).toMatchSnapshot();

      resultsAscending.forEach((res, idx) => {
        expect(res.name).toEqual(
          resultsDescending[resultsDescending.length - 1 - idx].name
        );
      });
    });
  });

  describe("Filter Functions", () => {
    // To be implemented, will need new fixture
    it("Filters by CDK Type", () => {
      const filterByCdk8s = FILTER_FUNCTIONS.cdkType(CDKType.cdk8s)!;
      expect(packages.filter(filterByCdk8s)).toEqual(
        packages.filter((p) => p.metadata.constructFramework?.name === "cdk8s")
      );
    });

    it("Filters by CDK Version", () => {
      const dataWithMoreVersions: CatalogPackage[] = packages.map((p) => ({
        ...p,
        metadata: {
          ...p.metadata,
          ...(p.metadata.constructFramework
            ? {
                constructFramework: {
                  ...p.metadata.constructFramework,
                  majorVersion: Math.round(Math.random()) + 1,
                },
              }
            : {}),
        },
      }));

      expect(
        dataWithMoreVersions.filter(FILTER_FUNCTIONS.cdkMajor(1)!)
      ).toEqual(
        dataWithMoreVersions.filter(
          (p) => p.metadata.constructFramework?.majorVersion === 1
        )
      );
    });

    it("Filters by a single language", () => {
      const filterByPython = FILTER_FUNCTIONS.language(Language.Python)!;
      expect(packages.filter(filterByPython)).toEqual(
        packages.filter((p) => p.languages.python !== undefined)
      );

      const filterByJava = FILTER_FUNCTIONS.language(Language.Java)!;

      expect(packages.filter(filterByJava)).toEqual(
        packages.filter((p) => p.languages.java !== undefined)
      );
    });

    it("Filters by multiple languages", () => {
      const filterByJavaOrPython = FILTER_FUNCTIONS.languages([
        Language.Python,
        Language.Java,
      ])!;

      expect(packages.filter(filterByJavaOrPython)).toEqual(
        packages.filter(
          (p) =>
            p.languages.java !== undefined || p.languages.python !== undefined
        )
      );

      // Gotcha case - TS is always supported so no filter function should be returned
      const filterByTypeScriptOrDotNet = FILTER_FUNCTIONS.languages([
        Language.TypeScript,
        Language.DotNet,
      ])!;

      expect(filterByTypeScriptOrDotNet).toBeUndefined();
    });
  });
});
