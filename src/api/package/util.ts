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
