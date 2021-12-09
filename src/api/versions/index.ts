import { API_PATHS } from "../../constants/url";

const NOT_FOUND = "NOT_FOUND";

/**
 * Package versions.
 */
export interface PackageVersions {
  readonly updated: string;
  readonly packages: { [key: string]: string[] };
}

const defaultVersions = { packages: {}, updated: NOT_FOUND };

export const fetchVersions = async (): Promise<PackageVersions> => {
  const response = await fetch(API_PATHS.ALL_VERSIONS);

  if (!response.ok) {
    console.error(response.statusText);
    console.warn("Could not retrieve package versions. Using empty data.");
    return defaultVersions;
  }

  return response.json().catch((err) => {
    console.error(err);
    console.warn("Error in package versions response. Using empty data.");
    return defaultVersions;
  });
};
