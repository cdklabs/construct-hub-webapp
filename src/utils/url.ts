export function parseSearch(search: string) {
  const params: any = {};
  const keyValues = search.substring(1, search.length).split("&");

  for (const kv of keyValues) {
    const parts = kv.split("=");
    params[parts[0]] = parts[1];
  }

  return params;
}
