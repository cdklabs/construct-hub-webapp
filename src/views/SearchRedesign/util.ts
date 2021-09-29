import { Language } from "../../constants/languages";

export const toNum = (val: string) => {
  const result = parseInt(val);

  if (`${result}` === "NaN") {
    return 0;
  }

  return result;
};

export const parseLangs = (langQuery: string | null) => {
  if (!langQuery) return [];

  const langs = decodeURIComponent(langQuery).split(",");
  return langs as Language[];
};
