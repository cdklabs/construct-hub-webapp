import { useQuery, UseQueryResult } from "react-query";
import { fetchStats, PackageStats } from "../../api/stats";

export type StatsQuery = UseQueryResult<PackageStats, Error | undefined>;

export const useStats = () => {
  const stats: StatsQuery = useQuery("stats", fetchStats);
  return stats;
};
