import config from "./config";
import type { AppConfig } from "types/config";

const appConfig: AppConfig = {
  hasAnalytics: false,
  ...config,
};

export default appConfig;
