import { API_PATHS } from "../../constants/url";

const NOT_FOUND = "NOT_FOUND";

/**
 * Download stats for all packages, indexed by npm package name.
 */
export interface PackageStats {
  readonly updated: string;
  readonly packages: { [key: string]: PackageStatsEntry };
}

/**
 * Download stats for a single package.
 */
export interface PackageStatsEntry {
  readonly downloads?: { npm: number };
}

const defaultStats = { packages: {}, updated: NOT_FOUND };

export const fetchStats = async (): Promise<PackageStats> => {
  const response = await fetch(API_PATHS.STATS);

  if (!response.ok) {
    console.error(response.statusText);
    console.warn("Could not retrieve package stats. Using empty stats.");
    return defaultStats;
  }

  return response.json().catch((err) => {
    console.error(err);
    console.warn("Error in package stats response. Using empty stats.");
    return defaultStats;
  });
};
