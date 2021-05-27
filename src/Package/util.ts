export function getAssetsPath(name: string, version: string, scope?: string) {
  const prefix = `/packages/`;
  const body = scope ? `${scope}/${name}` : name;
  const suffix = `@${version}`;
  return `${prefix}${body}${suffix}`;
}
