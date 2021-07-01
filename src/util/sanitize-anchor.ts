export const sanitize = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/ /g, "-");
};
