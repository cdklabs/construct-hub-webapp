import { createContext, FunctionComponent, useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { fetchStats, PackageStats } from "../../api/stats";

export type StatsQuery = UseQueryResult<PackageStats, Error | undefined>;

const StatsContext = createContext<StatsQuery | undefined>(undefined);

export const useStats = () => useContext(StatsContext)!;

export const StatsProvider: FunctionComponent = ({ children }) => {
  const stats: StatsQuery = useQuery("stats", fetchStats);

  return (
    <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
  );
};
