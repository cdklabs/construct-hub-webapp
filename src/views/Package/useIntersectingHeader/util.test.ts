import { MenuItem } from "../util";
import { getItemIds, normalizeId, getElementId, getSectionIdSet } from "./util";

const id = "#-FOO-bar-BaZ";

const menuItem: MenuItem = {
  level: 1,
  id: "#Validate-Normalized-ID",
  title: "",
  children: [
    {
      level: 2,
      id: "b",
      title: "",
      children: [
        {
          level: 3,
          id: "ba",
          title: "",
          children: [],
        },
      ],
    },
    {
      level: 2,
      id: "c",
      title: "",
      children: [
        {
          level: 3,
          id: "ca",
          title: "",
          children: [
            {
              level: 4,
              id: "caa",
              title: "",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

describe("normalizeId", () => {
  it("removes starting hash and lowercases the id", () => {
    expect(normalizeId(id)).toMatchInlineSnapshot(`"-foo-bar-baz"`);
  });
});

describe("getItemIds", () => {
  it("flattens arbitrarily nested menu item into a list of string ids", () => {
    expect(getItemIds(menuItem)).toMatchInlineSnapshot(`
      Array [
        "validate-normalized-id",
        "b",
        "ba",
        "c",
        "ca",
        "caa",
      ]
    `);
  });
});

describe("getElementId", () => {
  it("returns normalizedId from data-heading-title of element", () => {
    const el = document.createElement("div");
    el.setAttribute("data-heading-id", id);

    expect(getElementId(el)).toEqual(normalizeId(id));
  });
});

describe("getSectionIdSet", () => {
  it("returns a set of string section ids from a list of menuItems", () => {
    expect(getSectionIdSet([menuItem])).toMatchInlineSnapshot(`
      Set {
        "validate-normalized-id",
        "b",
        "ba",
        "c",
        "ca",
        "caa",
      }
    `);
  });
});
