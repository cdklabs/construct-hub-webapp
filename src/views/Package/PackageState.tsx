import type { Assembly } from "@jsii/spec";
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
import { NotFound } from "../NotFound";
import { Types, MenuItem, parseMarkdownStructure } from "./util";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
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
