import emoji from "node-emoji";
import { API_URL_RESOURCE, README_ITEM_ID } from "./constants";
import { Language } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { sanitize } from "../../util/sanitize-anchor";

export interface MenuItem {
  id: string;
  path?: string;
  title: string;
  children: MenuItem[];
  level: number;
}

export interface Types {
  [id: string]: {
    title: string;
    content: string;
  };
}

/**
 * Recursively insert menu items into appropriate parent's `children` array.
 */
const appendMenuItem = (items: MenuItem[], item: MenuItem): MenuItem[] => {
  const last = items[items.length - 1];

  if (last && last.level < item.level) {
    last.children = appendMenuItem(last.children, item);
    return items;
  }

  items.push(item);
  return items;
};

/**
 * Split markdown string on header lines. Accepts a `maxLevel` to only
 * parse to a specified level. Defaults to markdown maximum of `6`
 */
const splitOnHeaders = (md: string, maxLevel: number = 6): string[] => {
  // first matches code blocks to avoid matching any lines starting with '#'
  // inside of an escaped string.
  const regex = new RegExp(
    `(\`{3}[\\s\\S]*?(?:\`{3})|^#{1,${maxLevel}}[^#].*)`,
    "gm"
  );

  return (
    md
      .split(regex)
      // concatenate non-header content back together
      .reduce((accum: string[], str: string) => {
        const prev = accum[accum.length - 1];
        if (str.startsWith("#") || prev?.startsWith("#")) {
          return [...accum, str];
        }

        // Append blocks back to each other when neither are headers
        // This happens with code blocks.
        accum[accum.length - 1] += str;
        return accum;
      }, [])
  );
};

/**
 * Extract relevant data from markdown string for use as menu item. Attempts
 * to parse known data attributes of `title` and `id` while defaulting to use
 * the raw heading value as the default for both if data attributes are not
 * present.
 */
const getHeaderAttributes = (hdr: string): { id: string; title: string } => {
  const attrStrings: string[] =
    hdr.match(/(\S+)\s*=\s*(\"?)([^"]*)(\2|\s|$)/g) ?? [];
  const attrs: { [key: string]: string } = attrStrings.reduce((accum, str) => {
    const [key, value] = str.split("=");
    const [_, parsedValue] = /['"](.*?)['"]/.exec(value) ?? [];

    return {
      ...accum,
      [key]: parsedValue,
    };
  }, {});

  // Use raw title for items that don't specify data attributes, like readme
  // headers.
  const [_, rawTitle] =
    /^#*\s*(?:<a\s.*?(?:\/>|<\/a>))?\s*([^<]+?)\s*(?:<|$)/.exec(hdr) ?? [
      hdr,
      hdr,
    ];
  const noLinkTitle = rawTitle.replace(
    // Matches [label](text) and [label][text], replaces with just label.
    /\[([^\]]+)\](?:\([^)]+\)|\[[^\]]+\])/g,
    "$1"
  );
  const wEmoji = noLinkTitle.replace(
    /:\+1:|:-1:|:[\w-]+:/g,
    (match: string): string => {
      return emoji.get(match) ?? match;
    }
  );
  const title: string = attrs["data-heading-title"] ?? wEmoji;
  const id = attrs["data-heading-id"] ?? encodeURIComponent(sanitize(title));

  return { id, title };
};

const normalizeTitle = (title: string): string => {
  if (title.endsWith(".") || title.endsWith(":")) {
    title = title.slice(0, -1);
  }
  return title;
};

/**
 * Accept's markdown document from jsii-docgen with readme and api reference
 * documentation and parses the content into a traversable map of menu items
 * and types. This allows splitting the rendering of the readme and each item
 * in the api reference.
 *
 * NOTE: currently does not support setext style headings in readme documents.
 */
export const parseMarkdownStructure = (
  input: string,
  {
    scope,
    language,
    name,
    version,
    submodule,
  }: {
    scope?: string;
    language: Language;
    name: string;
    version: string;
    submodule?: string;
  }
): { readme: string; apiReference: Types; menuItems: MenuItem[] } => {
  const nameSegment = scope ? `${scope}/${name}` : `${name}`;
  const basePath = `/packages/${nameSegment}/v/${version}`;
  let query = `?${QUERY_PARAMS.LANGUAGE}=${language}`;
  if (submodule) {
    query += `&submodule=${submodule}`;
  }

  const separator =
    '# API Reference <span data-heading-title="API Reference" data-heading-id="api-reference"></span>';

  // split into readme and api reference
  const segments = input.split(separator);

  // Take the last chunk after the separator
  // segments.pop() always returns when length > 1;
  const apiReferenceStr = segments.length > 1 ? segments.pop()! : "";

  // Rejoin all the previous chunks in case the readme has the same Separator
  const readmeStr = segments.join(separator);

  //split each on headers
  const apiReferenceSplit = splitOnHeaders(apiReferenceStr, 3);
  const readmeSplit = splitOnHeaders(readmeStr);

  // Add back api reference title for use as menu item
  const apiReferenceParsed = [separator.trim(), ...(apiReferenceSplit ?? [])];
  const baseReadmePath = `${basePath}${query}`;
  let readmeChildren = readmeSplit.reduce((accum: MenuItem[], str: string) => {
    if (str.startsWith("#")) {
      const { id, title } = getHeaderAttributes(str);
      const level = str.match(/(#)/gm)?.length ?? 1;

      const normalizedTitle = normalizeTitle(title);

      const menuItem = {
        level,
        id,
        title: normalizedTitle,
        // root package path plus hash for header on readme item
        path: `${baseReadmePath}#${id}`,
        children: [],
      };
      return appendMenuItem(accum, menuItem);
    }
    return accum;
  }, []);

  if (readmeChildren.length === 1) {
    readmeChildren = readmeChildren[0].children;
  }

  const readmeMenuItems = [
    {
      level: 1,
      id: README_ITEM_ID,
      title: "Readme",
      path: baseReadmePath,
      children: readmeChildren,
    },
  ];

  let menuItems: MenuItem[] = [...readmeMenuItems];
  const types: Types = {};

  const getApiPath = (id: string) => `${basePath}/api/${id}${query}`;
  let prevType: { id: string; title: string };
  let prevLevel: number;

  apiReferenceParsed?.forEach((str) => {
    const isHeader = str.match(/(^#{1,3}[^#].*)/g);
    const level = str.match(/(#)/gm)?.length ?? 1;

    if (isHeader?.length) {
      const { id, title } = getHeaderAttributes(str);

      // root package path plus type id segment
      // only level 3 headers are types in api reference
      const path = level === 3 ? getApiPath(id) : undefined;
      const menuItem = {
        level,
        id,
        title,
        children: [],
        ...(path ? { path } : {}),
      };

      menuItems = appendMenuItem(menuItems, menuItem);
      prevType = { id, title };
      prevLevel = level;
    } else if (prevLevel === 3) {
      types[prevType.id] = { title: prevType.title, content: str };
    }
  });

  return {
    readme: readmeStr,
    apiReference: types,
    menuItems,
  };
};

export const isApiPath = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2] === API_URL_RESOURCE;
};
