import { CatalogSearchAPI } from "./catalog-search";
import { CatalogSearchSort } from "./constants";
import {
  SORT_FUNCTIONS,
  FILTER_FUNCTIONS,
  renderAllKeywords,
  mapConstructFrameworks,
} from "./util";
import catalogFixture from "../../__fixtures__/catalog.json";
import { CDKType } from "../../constants/constructs";
import { Language } from "../../constants/languages";
import { CatalogPackage } from "../package/packages";

describe("Catalog Search Utils", () => {
  const packages = [
    ...new CatalogSearchAPI(catalogFixture.packages as CatalogPackage[], {
      updated: "",
      packages: {},
    })
      .search()
      .values(),
  ];

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
        packages.filter((p) => p.constructFrameworks.get(CDKType.cdk8s))
      );
    });

    it("Filters by CDK Version", () => {
      expect(
        packages.filter(
          FILTER_FUNCTIONS.cdkMajor({ cdkType: CDKType.awscdk, cdkMajor: 1 })!
        )
      ).toEqual(
        packages.filter((p) => p.constructFrameworks.get(CDKType.awscdk) === 1)
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
            p.languages?.java !== undefined || p.languages?.python !== undefined
        )
      );

      // Gotcha case - TS is always supported so no filter function should be returned
      const filterByTypeScriptOrDotNet = FILTER_FUNCTIONS.languages([
        Language.TypeScript,
        Language.DotNet,
      ])!;

      expect(filterByTypeScriptOrDotNet).toBeUndefined();
    });

    it("Filters by one or more keywords", () => {
      const keywords = ["cicd", "s3"];

      [[keywords[0]], [keywords[1]], keywords].forEach((keywordGroup) => {
        expect(
          packages.filter(FILTER_FUNCTIONS.keywords(keywordGroup)!)
        ).toEqual(
          packages.filter((p) =>
            keywordGroup.some((keyword) => p.keywords?.includes(keyword))
          )
        );
      });
    });

    it("Treats tags as keywords", () => {
      const query = (...keywords: string[]) =>
        packages
          .filter(FILTER_FUNCTIONS.keywords(keywords)!)
          .map((r) => r.name);

      expect(query("databases")).toStrictEqual([
        "@aws-cdk/aws-lambda-nodejs",
        "aws-cdk-image-resize",
      ]);

      expect(query("partners")).toStrictEqual(["aws-cdk-image-resize"]);
      expect(query("databases", "partners")).toStrictEqual([
        "@aws-cdk/aws-lambda-nodejs",
        "aws-cdk-image-resize",
      ]);

      // only search in tags that are associated with keywords and not highlights.
      expect(query("non-keyword")).toStrictEqual([]);
    });
  });

  describe("renderAllKeywords", () => {
    it("returns a normalized set (all lowercase)", () => {
      expect(
        renderAllKeywords({
          ...packages[0],
          keywords: ["Foo", "foo", "FoO", "bar", "eh"],
        })
      ).toStrictEqual(["foo", "bar", "eh"]);
    });

    it("includes both publisher keywords and tag keywords", () => {
      expect(
        renderAllKeywords({
          ...packages[0],
          keywords: ["Foo", "foo", "FoO", "bar", "eh"],
          metadata: {
            date: "DATE",
            packageTags: [
              { id: "id1", keyword: { label: "boom" } },
              { id: "id2", keyword: { label: "bar" } },
              { id: "id3", highlight: { label: "baz" } },
            ],
          },
        })
      ).toStrictEqual(["foo", "bar", "eh", "boom"]);
    });

    it("filters out certain keywords", () => {
      expect(
        renderAllKeywords({
          ...packages[0],
          keywords: ["cdk-construct", "foo"],
          metadata: {
            date: "DATE",
            packageTags: [{ id: "id1", keyword: { label: "construct" } }],
          },
        })
      ).toStrictEqual(["foo"]);
    });
  });

  describe("mapConstructFrameworks", () => {
    const {
      constructFrameworks: _constructFrameworks,
      constructFramework: _constructFramework,
      ...baseMetadata
    } = packages[0].metadata;

    const constructFrameworks = [
      { name: CDKType.awscdk, majorVersion: 1 },
      { name: CDKType.cdk8s },
    ];

    const constructFramework = { name: CDKType.cdktf, majorVersion: 2 };

    it("maps metadata.constructFrameworks to a Map", () => {
      const metadata = {
        ...baseMetadata,
        constructFrameworks,
      };

      const result = mapConstructFrameworks(metadata);

      // Metadata defines AWS CDK with majorVersion 1
      expect(result.get(CDKType.awscdk)).toEqual(1);

      // Metadata defines cdk8s with no majorVersion
      expect(result.get(CDKType.cdk8s)).toEqual(null); // Returns null because there is no majorVersion

      // Metadata does not define cdktf
      expect(result.get(CDKType.cdktf)).toEqual(undefined);
    });

    // It should never have both properties
    it("ignores deprecated constructFramework property if constructFrameworks is defined", () => {
      const metadata = {
        ...baseMetadata,
        constructFramework,
        constructFrameworks,
      };

      const result = mapConstructFrameworks(metadata);

      // Metadata defines AWS CDK with majorVersion 1
      expect(result.get(CDKType.awscdk)).toEqual(1);

      // Metadata defines cdk8s with no majorVersion
      expect(result.get(CDKType.cdk8s)).toEqual(null); // Returns null because there is no majorVersion

      // constructFramework prop defines cdktf majorVersion 2, but should be ignored
      expect(result.get(CDKType.cdktf)).toEqual(undefined);
    });

    it("supports deprecated constructFramework property", () => {
      const metadata = { ...baseMetadata, constructFramework };
      const result = mapConstructFrameworks(metadata);

      expect(result.get(CDKType.cdktf)).toEqual(2);
    });
  });
});
