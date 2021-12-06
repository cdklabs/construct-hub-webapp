import { createContext, FunctionComponent, useContext } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useLocation } from "react-router-dom";
import { fetchConfig, Config } from "../../api/config";

export type ConfigQuery = UseQueryResult<Config>;

const ConfigContext = createContext<ConfigQuery | undefined>(undefined);

export const useConfig = () => useContext(ConfigContext)!;

export const ConfigProvider: FunctionComponent = ({ children }) => {
  const { search } = useLocation();
  const { data, ...config }: ConfigQuery = useQuery("config", fetchConfig);

  const configData = { ...data };

  // allow overriding feature flags using query params the query param name is
  // `ff-<flagName>`, for example,
  // `https://constructs.dev?ff-generalAvailability`.
  const params = new URLSearchParams(search);
  configData.featureFlags = configData.featureFlags ?? {};

  for (const key of params.keys()) {
    if (key.startsWith("ff-")) {
      const flagName = key.slice(3);
      (configData.featureFlags as Record<string, boolean>)[flagName] = true;
    }
  }

  return (
    <ConfigContext.Provider
      value={{ ...config, data: configData } as ConfigQuery}
    >
      {children}
    </ConfigContext.Provider>
  );
};
