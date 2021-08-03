import type { Assembly } from "@jsii/spec";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { PackageProps } from "./Package";
import { fetchAssembly } from "api/package/assembly";
import { fetchMarkdown } from "api/package/docs";
import { fetchMetadata, Metadata } from "api/package/metadata";
import { fetchPackages } from "api/package/packages";
import { Language } from "constants/languages";
import { __getPackagePath } from "util/url";

export type PackageParams = {
  name: string;
  scopedName?: string;
  version: string;
  lang: Language;
};

const getPackageStatics = ({ isScoped }: { isScoped: boolean }) => {
  const getStaticPaths: GetStaticPaths = async () => {
    const { packages } = await fetchPackages();

    const paths = Object.values(packages)
      .filter((pkg) => {
        const pkgIsScoped = pkg.name.includes("/");
        return isScoped ? pkgIsScoped : !pkgIsScoped;
      })
      .map((pkg) => {
        const { name, version } = pkg;

        return __getPackagePath({ name, version });
      });

    return {
      paths,
      // Means that pages that haven't yet been generated will be served from SSR first, and generated in background on server
      fallback: "blocking",
    };
  };

  const getStaticProps: GetStaticProps<PackageProps, PackageParams> = async (
    context
  ) => {
    const { params } = context;
    const { lang, name, version, scopedName } = params ?? {};

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
    } catch (e) {
      console.error(e);

      return {
        notFound: true,
      };
    }

    const markdown = await fetchMarkdown(
      scopedName ?? name,
      version,
      lang!, // TODO: Fix typing
      scopedName ? name : undefined
    );

    return {
      props: {
        assembly,
        metadata,
        markdown,
      },
      revalidate: 60 * 5, // 5 minutes
    };
  };

  return {
    getStaticPaths,
    getStaticProps,
  };
};

export default getPackageStatics;
