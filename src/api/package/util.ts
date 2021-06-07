export function getAssetsPath(name: string, version: string, scope?: string) {
  const prefix = `/packages/`;
  const body = getFullPackageName(name, scope);
  const suffix = `@${version}`;
  return `${prefix}${body}${suffix}`;
}

export function getFullPackageName(name: string, scope?: string) {
  return scope ? `${scope}/${name}` : name;
}

export function parseSearch(search: string) {
  const params: any = {};
  const keyValues = search.substring(1, search.length).split("&");

  for (const kv of keyValues) {
    const parts = kv.split("=");
    params[parts[0]] = parts[1];
  }

  return params;
}
