import type { AppConfig } from "types/config";

// Placeholder config - this will not work for deployments and needs to be defined from
// the construct-hub construct consumer
const config: AppConfig = {
  apiUrl: "https://constructs.dev",
  hasAnalytics: true,
};

export default config;
