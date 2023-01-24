import { CatalogPackage, Packages } from "./packages";
import { API_PATHS } from "../../constants/url";

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

export const findPackage = (
  catalog: Packages,
  pkg: string
): CatalogPackage | undefined => {
  const packages = catalog.packages.filter((p) => p.name === pkg);

  // return the most recently published version
  if (packages.length > 1) {
    return packages.sort((p1, p2) => {
      const date1 = new Date(p1.metadata.date);
      const date2 = new Date(p2.metadata.date);
      return date2.getTime() - date1.getTime();
    })[0];
  }

  return packages[0];
};
