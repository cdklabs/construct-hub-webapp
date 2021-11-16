import catalogFixture from "../../__fixtures__/catalog.json";
import statsFixture from "../../__fixtures__/stats.json";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { PackageStats } from "../stats";
import { CatalogSearchAPI } from "./catalog-search";
import { CatalogSearchSort } from "./constants";
import * as util from "./util";

describe("CatalogSearchAPI", () => {
  const instance = new CatalogSearchAPI(
    catalogFixture.packages as CatalogPackage[],
    statsFixture as PackageStats
  );

  it("exposes a property which returns detected cdk frameworks", () => {
    const cdkFrameWorkCount = catalogFixture.packages.reduce((sum, i) => {
      if (i.metadata.constructFramework?.name) {
        return sum + 1;
      }

      return sum;
    }, 0);

    const detectedCount = Object.values(instance.constructFrameworks).reduce(
      (sum, i) => sum + i.pkgCount,
      0
    );

    expect(detectedCount).toEqual(cdkFrameWorkCount);
  });

  it("Returns all results for empty search query", () => {
    expect(instance.search().size).toEqual(catalogFixture.packages.length);
  });

  it("Returns de-duplicated results", () => {
    const dedupedCatalog: CatalogPackage[] = [];
    for (const pkg of catalogFixture.packages) {
      const idx = dedupedCatalog.findIndex((p) => p.name === pkg.name);
      const maybePkg = dedupedCatalog[idx];

      if (!maybePkg) {
        dedupedCatalog.push(pkg as CatalogPackage);
      } else if (
        new Date(maybePkg.metadata.date) < new Date(pkg.metadata.date)
      ) {
        dedupedCatalog[idx] = pkg as CatalogPackage;
      }
    }

    const results = instance.search({ dedup: true });
    const packageNames = [...results.values()].map((pkg) => pkg.name);
    expect(packageNames.length).toEqual(dedupedCatalog.length);
    expect(
      dedupedCatalog.every((pkg) => packageNames.includes(pkg.name))
    ).toEqual(true);
  });

  it("Returns results filtered by multiple languages", () => {
    const javaAndPythonResults = instance.search({
      filters: { languages: [Language.Java, Language.Python] },
    });

    expect(javaAndPythonResults.size).toEqual(
      catalogFixture.packages.filter(
        (p) =>
          p.languages.java !== undefined || p.languages.python !== undefined
      ).length
    );
  });

  it("Returns results filtered by keywords", () => {
    const cicdOrS3Results = instance.search({
      filters: { keywords: ["cicd", "s3"] },
    });

    expect(cicdOrS3Results.size).toEqual(
      catalogFixture.packages.filter(
        (p) => p.keywords.includes("cicd") || p.keywords.includes("s3")
      ).length
    );
  });

  it("Ignores cdkMajor filter if no cdkType is passed", () => {
    const cdkMajorFilterSpy = jest.spyOn(util.FILTER_FUNCTIONS, "cdkMajor");

    instance.search({
      filters: {
        cdkType: CDKType.awscdk,
        cdkMajor: 2,
      },
    });

    expect(cdkMajorFilterSpy).toHaveBeenCalledWith(2);

    instance.search({
      filters: {
        cdkMajor: 3,
      },
    });

    expect(cdkMajorFilterSpy).toHaveBeenCalledWith(undefined);
  });

  it("Returns results ordered by Sort", () => {
    const publishDateAsc = [
      ...instance.search({ sort: CatalogSearchSort.PublishDateAsc }).values(),
    ];

    const publishDateDesc = [
      ...instance.search({ sort: CatalogSearchSort.PublishDateDesc }).values(),
    ];

    publishDateAsc.forEach(({ metadata: { date } }, index) => {
      expect(date).toEqual(
        publishDateDesc[publishDateDesc.length - 1 - index].metadata.date
      );
    });

    const nameAsc = [
      ...instance.search({ sort: CatalogSearchSort.NameAsc }).values(),
    ];
    const nameDesc = [
      ...instance.search({ sort: CatalogSearchSort.NameDesc }).values(),
    ];

    nameAsc.forEach(({ name }, index) => {
      expect(name).toEqual(nameDesc[nameDesc.length - 1 - index].name);
    });

    const downloadsAsc = [
      ...instance.search({ sort: CatalogSearchSort.DownloadsAsc }).values(),
    ];
    const downloadsDesc = [
      ...instance.search({ sort: CatalogSearchSort.DownloadsDesc }).values(),
    ];

    downloadsAsc.forEach(({ name }, index) => {
      expect(name).toEqual(
        downloadsDesc[downloadsDesc.length - 1 - index].name
      );
    });
  });

  describe("Snapshots", () => {
    it("Returns consistent query results", () => {
      const results = instance.search({
        query: "lambda libraries",
      });

      expect([...results].map(([id]) => id)).toMatchSnapshot();
    });

    it("Returns consistent filter results", () => {
      const results = instance.search({
        filters: {
          languages: [Language.Python],
        },
      });

      expect([...results].map(([id]) => id)).toMatchSnapshot();
    });

    it("Returns consistent sort results", () => {
      const results = instance.search({
        sort: CatalogSearchSort.NameAsc,
      });

      expect([...results].map(([id]) => id)).toMatchSnapshot();
    });
  });
});
