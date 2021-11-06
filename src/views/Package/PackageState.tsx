import type { Assembly } from "@jsii/spec";
import emoji from "node-emoji";
import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchMarkdown } from "../../api/package/docs";
import { fetchMetadata, Metadata } from "../../api/package/metadata";
import { Language, languageFilename } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";
import { sanitize } from "../../util/sanitize-anchor";
import { NotFound } from "../NotFound";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

interface MenuItem {
  id: string;
  path?: string;
  title: string;
  children: MenuItem[];
  level: number;
}

interface Types {
  [id: string]: {
    title: string;
    content: string;
  };
}

interface PackageState {
  apiReference?: Types;
  assembly: UseRequestResponse<Assembly>;
  hasDocs: boolean;
  hasError: boolean;
  isLoadingDocs: boolean;
  isSupported: boolean;
  language: Language;
  markdown: UseRequestResponse<string>;
  metadata: UseRequestResponse<Metadata>;
  name: string;
  pageDescription: string;
  pageTitle: string;
  readme?: string;
  scope?: string;
  version: string;
  menuItems: MenuItem[];
}

const PackageStateContext = createContext<PackageState | undefined>(undefined);

/**
 * Consumes shared page-leve data for components on the Package page
 */
export const usePackageState = () => {
  const state = useContext(PackageStateContext);

  if (!state) {
    throw new Error(
      "This component must be a child of a <PackageStateProvider />"
    );
  }

  return state;
};

export const appendMenuItem = (
  items: MenuItem[],
  item: MenuItem
): MenuItem[] => {
  const last = items[items.length - 1];

  if (last && last.level < item.level) {
    last.children = appendMenuItem(last.children, item);
    return items;
  }
  return [...items, item];
};

export const splitOnHeaders = (md: string, level: number): string[] => {
  if (!md) {
    return [];
  }

  const regex = new RegExp(`(^#{1,${level}}[^#].*)`, "gm");
  return (
    md
      ?.split(regex)
      // Trim lines and remove whitespace only entries
      .reduce((accum: string[], str: string) => {
        const newStr = str.trim();
        if (newStr === "") return accum;
        return [...accum, newStr];
      }, [])
  );
};

const getHeaderAttributes = (hdr: string): { id: string; title: string } => {
  const attrStrings = hdr.match(/(\S+)\s*=\s*(\"?)([^"]*)(\2|\s|$)/g) ?? [];
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
  const [_, rawTitle] = /^#*\s*([^<]+?)\s*(?:<|$)/.exec(hdr) ?? [];
  const wEmoji = rawTitle.replace(
    /:\+1:|:-1:|:[\w-]+:/g,
    (match: string): string => {
      return emoji.get(match) ?? match;
    }
  );
  const title: string = attrs["data-heading-title"] ?? wEmoji;
  const id = attrs["data-heading-id"] ?? encodeURIComponent(sanitize(title));

  return { id, title };
};

/**
 * Accept's markdown document from jsii-docgen with readme and api reference
 * documentation and parses the content into a traversable map of menu items
 * and types. This allows splitting the rendering of the readme and each item
 * in the api reference.
 */
export const parseMarkdownStructure = (
  input: string,
  {
    scope,
    language,
    name,
    version,
  }: { scope?: string; language: string; name: string; version: string }
): { readme: string; apiReference: Types; menuItems: MenuItem[] } => {
  const nameSegment = scope ? `${scope}/${name}` : `${name}`;
  const basePath = `/packages/${nameSegment}/v/${version}`;
  const langQuery = `?${QUERY_PARAMS.LANGUAGE}=${language}`;
  const separator =
    '\n# API Reference <span data-heading-title="API Reference" data-heading-id="api-reference"></span>\n';

  // split into readme and api reference
  const segments = input.split(separator);

  // Take the last chunk after the separator
  // segments.pop() always returns when length > 1;
  const apiReferenceStr = segments.length > 1 ? segments.pop()! : "";

  // Rejoin all the previous chunks in case the readme has the same Separator
  const readmeStr = segments.join(separator);

  //split each on headers
  const apiReferenceSplit = splitOnHeaders(apiReferenceStr, 3);
  const readmeSplit = splitOnHeaders(readmeStr, 6);

  // Add back api reference title for use as menu item
  const apiReferenceParsed = [separator.trim(), ...(apiReferenceSplit ?? [])];

  const baseReadmePath = `${basePath}${langQuery}`;
  const readmeMenuItems = [
    {
      level: 1,
      id: "Readme",
      title: "Readme",
      path: baseReadmePath,
      children: readmeSplit.reduce((accum: MenuItem[], str: string) => {
        if (str.startsWith("#")) {
          const { id, title } = getHeaderAttributes(str);
          const level = str.match(/(#)/gm)?.length ?? 1;
          const menuItem = {
            level,
            id,
            title,
            // root package path plus hash for header on readme item
            path: `${baseReadmePath}#${id}`,
            children: [],
          };
          return appendMenuItem(accum, menuItem);
        }
        return accum;
      }, []),
    },
  ];

  let menuItems: MenuItem[] = [...readmeMenuItems];
  const types: Types = {};

  const getApiPath = (id: string) => `${basePath}/api/${id}${langQuery}`;
  let prevType: { id: string; title: string };
  apiReferenceParsed?.forEach((str) => {
    // TODO get attributes off of embedded html
    const isHeader = str.match(/(^#{1,3}[^#].*)/gm);
    if (isHeader?.length) {
      const { id, title } = getHeaderAttributes(str);
      const level = str.match(/(#)/gm)?.length ?? 1;

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
    } else {
      types[prevType.id] = { title: prevType.title, content: str };
    }
  });

  return {
    readme: segments.join(separator),
    apiReference: types,
    menuItems,
  };
};

/**
 * Provides shared page-level data to components on the Package page
 */
export const PackageStateProvider: FunctionComponent = ({ children }) => {
  const { name, scope, version }: PathParams = useParams();
  const [requestMarkdown, markdownResponse] = useRequest(fetchMarkdown);
  const [requestAssembly, assemblyResponse] = useRequest(fetchAssembly);
  const [requestMetadata, metadataResponse] = useRequest(fetchMetadata);

  const q = useQueryParams();
  const [language] = useLanguage();
  const submodule = q.get(QUERY_PARAMS.SUBMODULE) ?? "";

  useEffect(() => {
    void requestMetadata(name, version, scope);
    void requestAssembly(name, version, scope);
  }, [name, requestAssembly, requestMetadata, scope, version]);

  useEffect(() => {
    void requestMarkdown(
      name,
      version,
      languageFilename[language],
      scope,
      submodule
    );
  }, [name, scope, version, language, submodule, requestMarkdown]);

  const pageTitle = `${scope ? `${scope}/${name}` : name} ${version}`;

  const pageDescription = assemblyResponse.data?.description ?? "";

  const hasError = Boolean(markdownResponse.error || assemblyResponse.error);

  const hasDocs = Boolean(
    !markdownResponse.loading &&
      !assemblyResponse.loading &&
      markdownResponse.data &&
      assemblyResponse.data
  );

  // This will also be true if it cannot be verified (assembly not there)
  const isSupported = Boolean(
    language === Language.TypeScript ||
      assemblyResponse.loading ||
      assemblyResponse.error ||
      assemblyResponse.data?.targets?.[language.toString()] != null
  );

  const isLoadingDocs = Boolean(
    !metadataResponse.loading &&
      (assemblyResponse.loading || markdownResponse.loading)
  );

  const parsedMd = useMemo(() => {
    if (!markdownResponse.data) return { menuItems: [] };

    return parseMarkdownStructure(markdownResponse.data, {
      scope,
      name,
      version,
      language,
    });
  }, [markdownResponse.data, name, scope, version, language]);

  // Handle missing JSON for assembly
  if (assemblyResponse.error) {
    return <NotFound />;
  }

  return (
    <PackageStateContext.Provider
      value={{
        assembly: assemblyResponse,
        hasDocs,
        hasError,
        isLoadingDocs,
        isSupported,
        language,
        markdown: markdownResponse,
        metadata: metadataResponse,
        name,
        pageDescription,
        pageTitle,
        scope,
        version,
        ...parsedMd,
      }}
    >
      {children}
    </PackageStateContext.Provider>
  );
};
