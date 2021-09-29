import catalogFixture from "../../__fixtures__/catalog.json";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";
import { CatalogSearchAPI } from "./catalog-search";
import { CatalogSearchSort } from "./constants";

describe("CatalogSearchAPI", () => {
  const instance = new CatalogSearchAPI(
    catalogFixture.packages as CatalogPackage[]
  );

  it("Returns all results for empty search query", () => {
    expect(instance.search().size).toEqual(catalogFixture.packages.length);
  });

  it("Returns results filtered by language", () => {
    const javaResults = instance.search({
      filters: { language: Language.Java },
    });

    expect(javaResults.size).toEqual(
      catalogFixture.packages.filter((p) => p.languages.java !== undefined)
        .length
    );

    const pythonResults = instance.search({
      filters: { language: Language.Python },
    });

    expect(pythonResults.size).toEqual(
      catalogFixture.packages.filter((p) => p.languages.python !== undefined)
        .length
    );
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
          language: Language.Python,
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
