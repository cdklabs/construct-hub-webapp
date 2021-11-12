import { Language } from "../../constants/languages";
import { parseMarkdownStructure } from "./util";

jest.mock("remark-emoji");
const README_MARKDOWN = `
# Title 1

SomeBodyText

## Title 2

SomeBodyText
`;

// Data types correspond to headings for `Constructs`, `Structs`, etc.
const DATA_TYPE_1 = "DATA_TYPE_1";
const DATA_TYPE_2 = "DATA_TYPE_2";

// Instance of given data type, aka a name of a class, construct, etc.
const MY_DATA_TYPE_1 = "MY_DATA_TYPE_1";
const MY_DATA_TYPE_2 = "MY_DATA_TYPE_2";

const MY_DATA_TYPE_22Body = `${MY_DATA_TYPE_2}-2Body

#### HEADER4

This is not parsed out
This is another line not parsed out`;

const MARKDOWN_INPUT = `${README_MARKDOWN}# API Reference <span data-heading-title="API Reference" data-heading-id="api-reference"></span>

## ${DATA_TYPE_1} <span data-heading-title="${DATA_TYPE_1}" data-heading-id="${DATA_TYPE_1}"></span>

### ${MY_DATA_TYPE_1}-1 <span data-heading-title="${MY_DATA_TYPE_1}-1" data-heading-id="${MY_DATA_TYPE_1}-1"></span>

${MY_DATA_TYPE_1}-1Body

### ${MY_DATA_TYPE_1}-2 <span data-heading-title="${MY_DATA_TYPE_1}-2" data-heading-id="${MY_DATA_TYPE_1}-2"></span>

${MY_DATA_TYPE_1}-2Body

## ${DATA_TYPE_2} <span data-heading-title="${DATA_TYPE_2}" data-heading-id="${DATA_TYPE_2}"></span>

### ${MY_DATA_TYPE_2}-1 <span data-heading-title="${MY_DATA_TYPE_2}-1" data-heading-id="${MY_DATA_TYPE_2}-1"></span>

${MY_DATA_TYPE_2}-1Body

### ${MY_DATA_TYPE_2}-2 <span data-heading-title="${MY_DATA_TYPE_2}-2" data-heading-id="${MY_DATA_TYPE_2}-2"></span>
${MY_DATA_TYPE_22Body}`;

const packageData = {
  scope: "@packageScope",
  name: "packageName",
  version: "0.0.0",
  language: Language.TypeScript,
};

describe("parseMarkdownStructure", () => {
  it("separates readme", () => {
    const { readme } = parseMarkdownStructure(MARKDOWN_INPUT, packageData);
    expect(readme).toEqual(README_MARKDOWN);
  });

  it("parses api reference structure", () => {
    const { apiReference } = parseMarkdownStructure(
      MARKDOWN_INPUT,
      packageData
    );
    expect(apiReference).toEqual({
      [`${MY_DATA_TYPE_1}-1`]: {
        title: `${MY_DATA_TYPE_1}-1`,
        content: `${MY_DATA_TYPE_1}-1Body`,
      },
      [`${MY_DATA_TYPE_1}-2`]: {
        title: `${MY_DATA_TYPE_1}-2`,
        content: `${MY_DATA_TYPE_1}-2Body`,
      },
      [`${MY_DATA_TYPE_2}-1`]: {
        title: `${MY_DATA_TYPE_2}-1`,
        content: `${MY_DATA_TYPE_2}-1Body`,
      },
      [`${MY_DATA_TYPE_2}-2`]: {
        title: `${MY_DATA_TYPE_2}-2`,
        content: MY_DATA_TYPE_22Body,
      },
    });
  });

  it("parses out menu items", () => {
    const { menuItems } = parseMarkdownStructure(MARKDOWN_INPUT, packageData);
    const basePath = "/packages/@packageScope/packageName/v/0.0.0";
    const baseApiPath = `${basePath}/api`;
    const langQuery = `?lang=${Language.TypeScript}`;
    const baseHashPath = `${basePath}${langQuery}`;
    expect(menuItems).toEqual([
      {
        level: 1,
        id: "Readme",
        title: "Readme",
        path: baseHashPath,
        children: [
          {
            level: 1,
            id: "title-1",
            title: "Title 1",
            path: `${baseHashPath}#title-1`,
            children: [
              {
                level: 2,
                id: "title-2",
                title: "Title 2",
                path: `${baseHashPath}#title-2`,
                children: [],
              },
            ],
          },
        ],
      },
      {
        level: 1,
        id: "api-reference",
        title: "API Reference",
        children: [
          {
            level: 2,
            id: DATA_TYPE_1,
            title: DATA_TYPE_1,
            children: [
              {
                level: 3,
                id: `${MY_DATA_TYPE_1}-1`,
                title: `${MY_DATA_TYPE_1}-1`,
                path: `${baseApiPath}/${MY_DATA_TYPE_1}-1${langQuery}`,
                children: [],
              },
              {
                level: 3,
                id: `${MY_DATA_TYPE_1}-2`,
                title: `${MY_DATA_TYPE_1}-2`,
                path: `${baseApiPath}/${MY_DATA_TYPE_1}-2${langQuery}`,
                children: [],
              },
            ],
          },
          {
            level: 2,
            id: DATA_TYPE_2,
            title: DATA_TYPE_2,
            children: [
              {
                level: 3,
                id: `${MY_DATA_TYPE_2}-1`,
                title: `${MY_DATA_TYPE_2}-1`,
                path: `${baseApiPath}/${MY_DATA_TYPE_2}-1${langQuery}`,
                children: [],
              },
              {
                level: 3,
                id: `${MY_DATA_TYPE_2}-2`,
                title: `${MY_DATA_TYPE_2}-2`,
                path: `${baseApiPath}/${MY_DATA_TYPE_2}-2${langQuery}`,
                children: [],
              },
            ],
          },
        ],
      },
    ]);
  });
});
