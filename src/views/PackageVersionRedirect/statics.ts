import { GetServerSideProps } from "next";
import { CatalogPackage, fetchPackages } from "api/package/packages";
import { sanitizeVersion } from "api/package/util";
import { Language } from "constants/languages";
import { getFullPackagePath } from "util/url";

const extractMajor = (ver: string) => {
  let sanitized = sanitizeVersion(ver);
  return sanitized.split(".")[0];
};

export const getServerSideProps: GetServerSideProps = async ({
  params = {},
}) => {
  const { name, scopedName, submodule } = params;

  let packageName = name as string;

  if (scopedName) {
    packageName += `/${scopedName}`;
  }

  if (!packageName) {
    return {
      notFound: true,
    };
  }

  const catalog = await fetchPackages();

  const packages = catalog.packages.filter((p) => p.name === packageName);

  if (!packages.length) {
    return {
      notFound: true,
    };
  }

  let pkg: CatalogPackage;

  if (packages.length > 1) {
    [pkg] = packages.sort((p1, p2) => {
      const mv1 = extractMajor(p1.version);
      const mv2 = extractMajor(p2.version);
      return mv2.localeCompare(mv1);
    });
  } else {
    [pkg] = packages;
  }

  const { version } = pkg;

  return {
    redirect: {
      destination: getFullPackagePath({
        name: packageName,
        submodule: typeof submodule === "string" ? submodule : undefined,
        version,
        lang: Language.TypeScript,
      }),
      permanent: false,
    },
  };
};
