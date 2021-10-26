export const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export const parseQueryArray = <T extends string>(
  queryString: string | null
) => {
  if (!queryString) return [];

  return decodeURIComponent(queryString).split(",") as T[];
};
