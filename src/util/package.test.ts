import {
  mapPackageKeywords,
  mapPackageTags,
  highlightsFrom,
  tagObjectsFrom,
} from "./package";
import { PackageTagConfig } from "../api/config";
import { KEYWORD_IGNORE_LIST } from "../constants/keywords";

const TAG1 = {
  id: "tag1",
  keyword: {
    label: "Tag 1",
    color: "red",
  },
};

const TAG1_LOOKALIKE = {
  id: "tag1-x",
  keyword: {
    label: "Tag 1",
    color: "orange",
  },
};

const TAG2 = {
  id: "tag2",
  keyword: {
    label: "Tag 2",
  },
};

const INVALID_TAG = {
  id: "invalidTag",
};

const HIGHLIGHT = {
  id: "tag3",
  highlight: {
    label: "Tag 3",
    icon: "tag.png",
    color: "blue",
  },
};

const PACKAGE_TAGS: PackageTagConfig[] = [TAG1, TAG2, INVALID_TAG, HIGHLIGHT];

const KEYWORDS = [
  "Keyword 1",
  "Keyword 2",
  KEYWORD_IGNORE_LIST.values().next().value,
  undefined,
  null,
  false,
  "",
];

describe("mapPackageKeywords", () => {
  it("Returns an empty array if package keywords are undefined", () => {
    expect(mapPackageKeywords(undefined)).toEqual([]);
  });

  it("Returns a list of tag objects", () => {
    expect(mapPackageKeywords(KEYWORDS)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Keyword 1",
          "keyword": Object {
            "label": "Keyword 1",
          },
        },
        Object {
          "id": "Keyword 2",
          "keyword": Object {
            "label": "Keyword 2",
          },
        },
      ]
    `);
  });

  it("Filters out ignored keywords", () => {
    const results = mapPackageKeywords(KEYWORDS);

    expect(results.find(({ id }) => KEYWORD_IGNORE_LIST.has(id))).toEqual(
      undefined
    );
  });

  it("Filters out falsy keywords", () => {
    const results = mapPackageKeywords(KEYWORDS);

    expect(results.find((r) => !r.keyword === true)).toEqual(undefined);
  });
});

describe("mapPackageTags", () => {
  it("Returns an empty array if package tags are undefined", () => {
    expect(mapPackageTags(undefined)).toEqual([]);
  });

  it("Returns a list of TagObjects", () => {
    expect(mapPackageTags(PACKAGE_TAGS)).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Tag 1",
          "keyword": Object {
            "color": "red",
            "label": "Tag 1",
          },
        },
        Object {
          "id": "Tag 2",
          "keyword": Object {
            "label": "Tag 2",
          },
        },
      ]
    `);
  });

  it("Filters out highlights by default", () => {
    expect(mapPackageTags(PACKAGE_TAGS).find((t) => t.highlight)).toEqual(
      undefined
    );
  });

  it("Filters out tags with invalid keywords", () => {
    expect(
      mapPackageTags(PACKAGE_TAGS).find((t) => t.id === INVALID_TAG.id)
    ).toEqual(undefined);
  });
});

describe("tagObjectsFrom", () => {
  it("Returns an empty array if tags and keywords are undefined", () => {
    expect(tagObjectsFrom({})).toEqual([]);
  });

  it("Returns a list of TagObjects from tags and keywords", () => {
    expect(
      tagObjectsFrom({
        packageTags: PACKAGE_TAGS,
        keywords: KEYWORDS,
      })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Tag 1",
          "keyword": Object {
            "color": "red",
            "label": "Tag 1",
          },
        },
        Object {
          "id": "Tag 2",
          "keyword": Object {
            "label": "Tag 2",
          },
        },
        Object {
          "id": "Keyword 1",
          "keyword": Object {
            "label": "Keyword 1",
          },
        },
        Object {
          "id": "Keyword 2",
          "keyword": Object {
            "label": "Keyword 2",
          },
        },
      ]
    `);
  });

  it("Returns a list of TagObjects from only tags", () => {
    expect(tagObjectsFrom({ packageTags: PACKAGE_TAGS }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Tag 1",
          "keyword": Object {
            "color": "red",
            "label": "Tag 1",
          },
        },
        Object {
          "id": "Tag 2",
          "keyword": Object {
            "label": "Tag 2",
          },
        },
      ]
    `);
  });

  it("Returns a list of TagObjects from only Keywords", () => {
    expect(tagObjectsFrom({ keywords: KEYWORDS })).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Keyword 1",
          "keyword": Object {
            "label": "Keyword 1",
          },
        },
        Object {
          "id": "Keyword 2",
          "keyword": Object {
            "label": "Keyword 2",
          },
        },
      ]
    `);
  });

  it("Removes keywords with same name as tags", () => {
    expect(
      tagObjectsFrom({ packageTags: [TAG1], keywords: ["Tag 1", "Keyword 1"] })
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Tag 1",
          "keyword": Object {
            "color": "red",
            "label": "Tag 1",
          },
        },
        Object {
          "id": "Keyword 1",
          "keyword": Object {
            "label": "Keyword 1",
          },
        },
      ]
    `);
  });

  it("Removes tags with same label", () => {
    expect(tagObjectsFrom({ packageTags: [TAG1, TAG1_LOOKALIKE] }))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "Tag 1",
          "keyword": Object {
            "color": "red",
            "label": "Tag 1",
          },
        },
      ]
    `);
  });
});

describe("highlightsFrom", () => {
  it("Returns an empty array if packageTags are undefined", () => {
    expect(highlightsFrom(undefined)).toEqual([]);
  });

  it("Returns a list of package highlights", () => {
    expect(highlightsFrom(PACKAGE_TAGS)).toMatchInlineSnapshot(`
      Array [
        Object {
          "color": "blue",
          "icon": "tag.png",
          "label": "Tag 3",
        },
      ]
    `);
  });
});
