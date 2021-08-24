import type { AppConfig } from "../types/config";
import config from "./config";

export interface Config extends Required<AppConfig> {}

const base: Config = {
  apiUrl: "",
  disableContent: {
    faq: false,
  },
  hasAnalytics: false,
};

const final: Config = {
  ...base,
  ...config,
};

export default final;
