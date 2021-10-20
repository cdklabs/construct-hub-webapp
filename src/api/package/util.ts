import { API_PATHS } from "../../constants/url";
import { CatalogPackage, Packages } from "./packages";

export const getFullPackageName = (name: string, scope?: string) => {
  return scope ? `${scope}/${name}` : name;
};

export const getAssetsPath = (
  name: string,
  version: string,
  scope?: string
) => {
  const prefix = `${API_PATHS.PACKAGES_PREFIX}/`;
  const body = getFullPackageName(name, scope);
  const suffix = `/v${version}`;
  return `${prefix}${body}${suffix}`;
};

export const sanitizeVersion = (ver: string) => {
  let sanitized = ver;
  if (sanitized.startsWith("~") || sanitized.startsWith("^")) {
    sanitized = sanitized.substring(1);
  }
  return sanitized;
};

const extractMajor = (ver: string) => {
  let sanitized = sanitizeVersion(ver);
  return sanitized.split(".")[0];
};

export const findPackage = (
  catalog: Packages,
  pkg: string
): CatalogPackage | undefined => {
  const packages = catalog.packages.filter((p) => p.name === pkg);

  if (packages.length > 1) {
    return packages.sort((p1, p2) => {
      const mv1 = extractMajor(p1.version);
      const mv2 = extractMajor(p2.version);
      return mv2.localeCompare(mv1);
    })[0];
  }

  return packages[0];
};
