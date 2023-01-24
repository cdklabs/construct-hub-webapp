import { mapTagsToFilterGroups } from "./TagFilter";
import { TagGroupConfig } from "../../api/config";

const tagGroups = new Map<string, TagGroupConfig>();
tagGroups.set("a", { id: "a", label: "A" });
tagGroups.set("b", { id: "b", filterType: "radio" });

describe("mapTagsToFilterGroups", () => {
  it("Maps tags to filter group object", () => {
    const packageTags = [
      { id: "foo", searchFilter: { groupBy: "a", display: "Foo" } },
      { id: "bar", searchFilter: { groupBy: "b", display: "Bar" } },
      { id: "baz", searchFilter: { groupBy: "c", display: "Baz" } },
    ];

    expect(mapTagsToFilterGroups(packageTags, tagGroups))
      .toMatchInlineSnapshot(`
      Object {
        "a": Object {
          "id": "a",
          "label": "A",
          "tags": Array [
            Object {
              "id": "foo",
              "searchFilter": Object {
                "display": "Foo",
                "groupBy": "a",
              },
            },
          ],
        },
        "b": Object {
          "filterType": "radio",
          "id": "b",
          "tags": Array [
            Object {
              "id": "bar",
              "searchFilter": Object {
                "display": "Bar",
                "groupBy": "b",
              },
            },
          ],
        },
        "c": Object {
          "id": "c",
          "tags": Array [
            Object {
              "id": "baz",
              "searchFilter": Object {
                "display": "Baz",
                "groupBy": "c",
              },
            },
          ],
        },
      }
    `);
  });

  it("Does not group tags that do not have searchFilter.groupBy", () => {
    const packageTags = [
      { id: "foo", searchFilter: {} },
      { id: "bar", searchFilter: {} },
    ];

    expect(mapTagsToFilterGroups(packageTags as any, tagGroups)).toEqual({});
  });

  it("Groups tags to corresponding tag groups from config", () => {
    const packageTags = [
      { id: "foo", searchFilter: { groupBy: "a", display: "Foo" } },
      { id: "bar", searchFilter: { groupBy: "b", display: "Bar" } },
    ];

    expect(mapTagsToFilterGroups(packageTags, tagGroups)).toEqual({
      a: {
        ...tagGroups.get("a"),
        tags: [packageTags[0]],
      },
      b: {
        ...tagGroups.get("b"),
        tags: [packageTags[1]],
      },
    });
  });

  it("Groups tags that don't have a corresponding tag group from config", () => {
    const packageTags = [
      { id: "foo", searchFilter: { groupBy: "Author", display: "foo" } },
      { id: "bar", searchFilter: { groupBy: "Use Case", display: "bar" } },
    ];

    expect(mapTagsToFilterGroups(packageTags, new Map())).toEqual({
      Author: {
        id: "Author",
        tags: [packageTags[0]],
      },
      "Use Case": {
        id: "Use Case",
        tags: [packageTags[1]],
      },
    });
  });
});
