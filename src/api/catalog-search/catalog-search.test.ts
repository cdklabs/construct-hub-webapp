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

  it("Returns results ordered by Sort", () => {
    const publishDateAsc = [
      ...instance.search({ sort: CatalogSearchSort.PublishDateAsc }),
    ];

    const publishDateDesc = [
      ...instance.search({ sort: CatalogSearchSort.PublishDateDesc }),
    ];

    expect(publishDateAsc).toEqual(publishDateDesc.reverse());
  });
});
