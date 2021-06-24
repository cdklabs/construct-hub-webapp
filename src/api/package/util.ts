import * as consts from "../../constants/paths";

export function getAssetsPath(name: string, version: string, scope?: string) {
  const prefix = `${consts.PACKAGES_PREFIX}/`;
  const body = getFullPackageName(name, scope);
  const suffix = `/v${version}`;
  return `${prefix}${body}${suffix}`;
}

export function getFullPackageName(name: string, scope?: string) {
  return scope ? `${scope}/${name}` : name;
}
