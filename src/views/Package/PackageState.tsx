import type { Assembly } from "@jsii/spec";
import type { Schema } from "jsii-docgen";
import { createContext, FunctionComponent, useContext, useMemo } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { fetchAssembly } from "../../api/package/assembly";
import { fetchJsonDocs, fetchMarkdownDocs } from "../../api/package/docs";
import { fetchMetadata, Metadata } from "../../api/package/metadata";
import { Language, languageFilename } from "../../constants/languages";
import { QUERY_PARAMS } from "../../constants/url";
import { useLanguage } from "../../hooks/useLanguage";
import { useQueryParams } from "../../hooks/useQueryParams";
import { useVersions } from "../../hooks/useVersions";
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
  markdownDocs: UseQueryResult<string>;
  jsonDocs: UseQueryResult<Schema>;
  metadata: UseQueryResult<Metadata>;
  name: string;
  pageDescription: string;
  pageTitle: string;
  readme?: string;
  scope?: string;
  version: string;
  allVersions?: string[];
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

  const { data: versionData } = useVersions();
  const pkgName = scope ? `${scope}/${name}` : name;
  const allVersions = versionData?.packages[pkgName];

  const markdownDocs = useQuery(`${id}-docs-${language}-${submodule}-md`, () =>
    fetchMarkdownDocs(
      name,
      version,
      languageFilename[language],
      scope,
      submodule
    )
  );

  const jsonDocs = useQuery(`${id}-docs-${language}-${submodule}-json`, () =>
    fetchJsonDocs(name, version, languageFilename[language], scope, submodule)
  );

  const assembly = useQuery(`${id}-assembly`, () =>
    fetchAssembly(name, version, scope)
  );

  const metadata = useQuery(`${id}-metadata`, () =>
    fetchMetadata(name, version, scope)
  );

  const pageTitle = `${scope ? `${scope}/${name}` : name} ${version}`;

  const pageDescription = assembly.data?.description ?? "";

  const hasError = Boolean(
    markdownDocs.error || jsonDocs.error || assembly.error
  );

  const hasDocs = Boolean(
    !markdownDocs.isLoading &&
      !jsonDocs.isLoading &&
      !assembly.isLoading &&
      markdownDocs.data &&
      jsonDocs.data &&
      assembly.data
  );

  // This will also be true if it cannot be verified (assembly not there)
  const isSupported = Boolean(
    language === Language.TypeScript ||
      assembly.isLoading ||
      assembly.error ||
      assembly.data?.targets?.[language.toString()] != null
  );

  const isLoadingDocs = Boolean(
    !metadata.isLoading &&
      (assembly.isLoading || markdownDocs.isLoading || jsonDocs.isLoading)
  );

  const parsedMd = useMemo(() => {
    if (!markdownDocs.data) return { menuItems: [] };

    return parseMarkdownStructure(markdownDocs.data, {
      scope,
      name,
      version,
      language,
      submodule,
    });
  }, [markdownDocs.data, name, scope, version, language, submodule]);

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
        markdownDocs,
        jsonDocs,
        metadata: metadata,
        name,
        pageDescription,
        pageTitle,
        scope,
        version,
        allVersions,
        ...parsedMd,
      }}
    >
      {children}
    </PackageStateContext.Provider>
  );
};
