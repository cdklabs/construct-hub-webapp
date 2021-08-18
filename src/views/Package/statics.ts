import type { Assembly } from "@jsii/spec";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { PackageProps } from "./Package";
import { fetchAssembly } from "api/package/assembly";
import { fetchMarkdown } from "api/package/docs";
import { fetchMetadata, Metadata } from "api/package/metadata";
import { fetchPackages } from "api/package/packages";
import { Language, TEMP_SUPPORTED_LANGUAGES } from "constants/languages";
import { getFullPackagePath } from "util/url";

export type PackageParams = {
  name: string;
  scopedName?: string;
  version: string;
  lang: Language;
  submodule?: string;
};

export interface GetPackageStaticsParams {
  isScoped: boolean;
  isSubmodule?: boolean;
}

export const getPackageStatics = ({
  isSubmodule,
  isScoped,
}: GetPackageStaticsParams) => {
  const getStaticPaths: GetStaticPaths = async () => {
    // No way to efficiently pre-generate submodules at build time, so we can just generate them on-demand
    if (isSubmodule) {
      return {
        paths: [],
        fallback: "blocking",
      };
    }

    const { packages } = await fetchPackages();

    const paths = Object.values(packages)
      .sort((p1, p2) => {
        // Sort most recent updated first
        const d1 = new Date(p1.metadata.date);
        const d2 = new Date(p2.metadata.date);
        if (d1 === d2) {
          return 0;
        }
        return d1 < d2 ? 1 : -1;
      })
      .slice(0, 25) // Take 25 of the most recent from sort
      .filter((pkg) => {
        // Filter out the packages that don't match the route
        const pkgIsScoped = pkg.name.includes("/");
        return isScoped ? pkgIsScoped : !pkgIsScoped;
      })
      .reduce<string[]>((allPaths, pkg) => {
        const { name, version, languages } = pkg;

        // TS is always supported
        allPaths.push(
          getFullPackagePath({ name, version, lang: Language.TypeScript })
        );

        Object.keys(languages).forEach((language) => {
          const lang = language as Language;

          if (TEMP_SUPPORTED_LANGUAGES.has(lang)) {
            allPaths.push(getFullPackagePath({ name, version, lang }));
          }
        });

        return allPaths;
      }, []);

    return {
      paths,
      fallback: "blocking",
    };
  };

  const getStaticProps: GetStaticProps<PackageProps, PackageParams> = async (
    context
  ) => {
    const { params } = context;
    const { lang, name, version, scopedName, submodule } = params ?? {};

    if (!(name && version)) return { notFound: true };

    let assembly: Assembly;
    let metadata: Metadata;

    try {
      if (scopedName) {
        assembly = await fetchAssembly(scopedName, version, name);
        metadata = await fetchMetadata(scopedName, version, name);
      } else {
        assembly = await fetchAssembly(name, version);
        metadata = await fetchMetadata(name, version);
      }
    } catch {
      return {
        notFound: true,
      };
    }
    let markdown: string | null = null;

    try {
      markdown = await fetchMarkdown(
        scopedName ?? name,
        version,
        lang!, // TODO: Fix typing
        scopedName ? name : undefined,
        submodule
      );
    } catch (e) {
      console.error(e);
    }

    return {
      props: {
        assembly,
        metadata,
        markdown,
      },
      revalidate: 60 * 5,
    };
  };

  return {
    getStaticPaths,
    getStaticProps,
  };
};
