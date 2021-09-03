import { API_PATHS } from "../../constants/url";

export interface PackageLinksConfig {
  name: string;
  value: string;
  displayText?: string;
}

export interface Config {
  packageLinks?: PackageLinksConfig[];
}

const defaultConfig: Config = {};

export const fetchConfig = async (): Promise<Config> => {
  const response = await fetch(API_PATHS.CONFIG);

  if (!response.ok) {
    console.log("Failed to fetch application config, using default values");
    return defaultConfig;
  }

  return response.json().catch((err) => {
    console.error(err);
    console.log("Invalid config response, using default values");
    return defaultConfig;
  });
};
