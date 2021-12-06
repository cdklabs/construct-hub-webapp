import type { Assembly } from "@jsii/spec";
import { createContext, FunctionComponent, useContext, useMemo } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchMarkdown } from "../../api/package/docs";
import { fetchMetadata, Metadata } from "../../api/package/metadata";
import { Language, languageFilename } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { NotFound } from "../NotFound";
import { Types, MenuItem, parseMarkdownStructure } from "./util";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

interface PackageState {
  apiReference?: Types;
  assembly: UseQueryResult<Assembly>;
  hasDocs: boolean;
  hasError: boolean;
  isLoadingDocs: boolean;
  isSupported: boolean;
  language: Language;
  markdown: UseQueryResult<string>;
  metadata: UseQueryResult<Metadata>;
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

/**
 * Provides shared page-level data to components on the Package page
 */
export const PackageStateProvider: FunctionComponent = ({ children }) => {
  const { name, scope, version }: PathParams = useParams();
  const id = `${scope}/${name}/v${version}`;
  const [language] = useLanguage();
  const q = useQueryParams();
  const submodule = q.get(QUERY_PARAMS.SUBMODULE) ?? "";

  const markdown = useQuery(`${id}-docs-${language}`, () =>
    fetchMarkdown(name, version, languageFilename[language], scope, submodule)
  );

  const assembly = useQuery(`${id}-assembly`, () =>
    fetchAssembly(name, version, scope)
  );

  const metadata = useQuery(`${id}-metadata`, () =>
    fetchMetadata(name, version, scope)
  );

  const pageTitle = `${scope ? `${scope}/${name}` : name} ${version}`;

  const pageDescription = assembly.data?.description ?? "";

  const hasError = Boolean(markdown.error || assembly.error);

  const hasDocs = Boolean(
    !markdown.isLoading && !assembly.isLoading && markdown.data && assembly.data
  );

  // This will also be true if it cannot be verified (assembly not there)
  const isSupported = Boolean(
    language === Language.TypeScript ||
      assembly.isLoading ||
      assembly.error ||
      assembly.data?.targets?.[language.toString()] != null
  );

  const isLoadingDocs = Boolean(
    !metadata.isLoading && (assembly.isLoading || markdown.isLoading)
  );

  const parsedMd = useMemo(() => {
    if (!markdown.data) return { menuItems: [] };

    return parseMarkdownStructure(markdown.data, {
      scope,
      name,
      version,
      language,
      submodule,
    });
  }, [markdown.data, name, scope, version, language, submodule]);

  // Handle missing JSON for assembly
  if (assembly.error) {
    return <NotFound />;
  }

  return (
    <PackageStateContext.Provider
      value={{
        assembly: assembly,
        hasDocs,
        hasError,
        isLoadingDocs,
        isSupported,
        language,
        markdown: markdown,
        metadata: metadata,
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
