import catalogFixture from "../../__fixtures__/catalog.json";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { SORT_FUNCTIONS, FILTER_FUNCTIONS } from "./util";

const packages = catalogFixture.packages as CatalogPackage[];

describe("Catalog Search Utils", () => {
  describe("Sort Functions", () => {
    it("Sorts by Publish Date", () => {
      const resultsAscending = packages.sort(SORT_FUNCTIONS.PublishDateAsc);
      const resultsDescending = packages.sort(SORT_FUNCTIONS.PublishDateDesc);

      expect(resultsAscending).toMatchSnapshot();
      expect(resultsDescending).toEqual(resultsAscending.reverse());
    });

    it("Sorts by Package Name", () => {
      const resultsAscending = packages.sort(SORT_FUNCTIONS.NameAsc);
      const resultsDescending = packages.sort(SORT_FUNCTIONS.NameDesc);

      expect(resultsAscending).toMatchSnapshot();
      expect(resultsDescending).toEqual(resultsAscending.reverse());
    });
  });

  describe("Filter Functions", () => {
    // To be implemented, will need new fixture
    it.skip("Filters by CDK Type", () => {
      const filterByCdk8s = FILTER_FUNCTIONS.cdkType(CDKType.cdk8s)!;
      expect(packages.filter(filterByCdk8s)).toEqual(
        packages.filter((p) => (p.metadata as any).cdkType === "cdk8s")
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
