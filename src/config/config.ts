import type { AppConfig } from "types/config";

// Placeholder config - this will not work for deployments and needs to be defined from
// the construct-hub construct consumer
const config: AppConfig = {
  apiUrl: process.env.API_URL ?? "",
  hasAnalytics: true,
};

export default config;
