import { API_PATHS } from "../../constants/url";

export interface PackageLinkConfig {
  linkLabel: string;
  configKey: string;
  linkText?: string;
}

export interface PackageTagConfig {
  label: string;
  color?: string;
}

export interface FeatureFlags {
  homeRedesign?: boolean;
  searchRedesign?: boolean;
}

export interface Config {
  featureFlags?: FeatureFlags;
  packageLinks?: PackageLinkConfig[];
  packageTags?: PackageTagConfig[];
}

const defaultConfig: Config = {};

export const fetchConfig = async (): Promise<Config> => {
  if (window.configOverride) {
    return window.configOverride;
  }

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
