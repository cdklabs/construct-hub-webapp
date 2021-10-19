import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { fetchStats, PackageStats } from "../../api/stats";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";

const StatsContext = createContext<UseRequestResponse<PackageStats>>({
  loading: false,
  data: undefined,
  error: undefined,
});

export const useStats = () => useContext(StatsContext);

export const StatsProvider: FunctionComponent = ({ children }) => {
  const [requestStats, statsResponse] = useRequest(fetchStats);

  useEffect(() => {
    void requestStats();
  }, [requestStats]);

  return (
    <StatsContext.Provider value={statsResponse}>
      {children}
    </StatsContext.Provider>
  );
};
