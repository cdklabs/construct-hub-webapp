import catalogFixture from "../../__fixtures__/catalog.json";
import statsFixture from "../../__fixtures__/stats.json";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { PackageStats } from "../stats";
import { CatalogSearchAPI } from "./catalog-search";
import { CatalogSearchSort } from "./constants";

describe("CatalogSearchAPI", () => {
  const instance = new CatalogSearchAPI(
    catalogFixture.packages as CatalogPackage[],
    statsFixture as PackageStats
  );

  const dedupedCatalog: CatalogPackage[] = [];
  for (const pkg of catalogFixture.packages) {
    const idx = dedupedCatalog.findIndex((p) => p.name === pkg.name);
    const maybePkg = dedupedCatalog[idx];

    if (!maybePkg) {
      dedupedCatalog.push(pkg as CatalogPackage);
    } else if (new Date(maybePkg.metadata.date) < new Date(pkg.metadata.date)) {
      dedupedCatalog[idx] = pkg as CatalogPackage;
    }
  }

  it("exposes a property which returns detected cdk frameworks", () => {
    const cdkFrameWorkCount = [...instance.search().values()].reduce(
      (sum, { constructFrameworks }) => sum + constructFrameworks.size,
      0
    );

    const detectedCount = Object.values(instance.constructFrameworks).reduce(
      (sum, i) => sum + i.pkgCount,
      0
    );

    expect(detectedCount).toEqual(cdkFrameWorkCount);
  });

  it("Returns de-duplicated results for empty search query", () => {
    const results = instance.search();
    const packageNames = [...results.values()].map((pkg) => pkg.name);
    expect(packageNames.length).toBeLessThan(catalogFixture.packages.length);
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
      dedupedCatalog.filter(
        (p) =>
          p.languages?.java !== undefined || p.languages?.python !== undefined
      ).length
    );
  });

  it("Returns results filtered by keywords", () => {
    const cicdOrS3Results = instance.search({
      filters: { keywords: ["cicd", "s3"] },
    });

    expect(cicdOrS3Results.size).toEqual(
      dedupedCatalog.filter(
        (p) => p.keywords?.includes("cicd") || p.keywords?.includes("s3")
      ).length
    );
  });

  it("Support partially matched keywords", () => {
    const [p1, p2, p3] = [...catalogFixture.packages];
    p1.keywords = ["dynamodb"];
    p2.keywords = ["amazon dynamodb"];
    p3.keywords = ["eks"];

    const testInstance = new CatalogSearchAPI(
      [p1, p2, p3] as CatalogPackage[],
      statsFixture
    );

    const dynamodbResults = [
      ...testInstance
        .search({
          query: "dynamodb",
        })
        .values(),
    ];

    const [extendedP1] = testInstance.findByName(p1.name);
    const [extendedP2] = testInstance.findByName(p2.name);

    expect([...dynamodbResults.values()]).toEqual([extendedP1, extendedP2]);
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

  it("Returns only exact instances of a package in findByName", () => {
    expect(instance.search({ query: "@aws-cdk/aws-ecr" }).size).toBeGreaterThan(
      1
    );

    const results = instance.findByName("@aws-cdk/aws-ecr");

    // does not match @aws-cdk/aws-ecr-assets
    expect(results.length).toEqual(1);
    expect(results[0].name).toEqual("@aws-cdk/aws-ecr");
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
