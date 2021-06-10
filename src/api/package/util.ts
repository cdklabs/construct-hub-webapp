export function getAssetsPath(name: string, version: string, scope?: string) {
  const prefix = `/packages/`;
  const body = getFullPackageName(name, scope);
  const suffix = `@${version}`;
  return `${prefix}${body}${suffix}`;
}

export function getFullPackageName(name: string, scope?: string) {
  return scope ? `${scope}/${name}` : name;
}
