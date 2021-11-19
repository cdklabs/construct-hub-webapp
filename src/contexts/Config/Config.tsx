import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { fetchConfig, Config } from "../../api/config";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";

const ConfigContext = createContext<UseRequestResponse<Config>>({
  loading: false,
  data: undefined,
  error: undefined,
});

const LOCAL_CONFIG = "construct-hub-config";

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: FunctionComponent = ({ children }) => {
  const { search } = useLocation();
  const [configData, setConfigData] = useState<Config | undefined>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_CONFIG);
      const parsed = stored ? JSON.parse(stored) : undefined;
      return parsed;
    } catch (e) {
      console.error(e);
    }

    return undefined;
  });

  const [requestConfig, configResponse] = useRequest(fetchConfig, {
    onSuccess: (res) => {
      setConfigData(res);

      try {
        localStorage.setItem(LOCAL_CONFIG, JSON.stringify(res));
      } catch (e) {
        console.error(e);
      }
    },
  });

  useEffect(() => {
    void requestConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const config = configData ?? {};

  // allow overriding feature flags using query params the query param name is
  // `ff-<flagName>`, for example,
  // `https://constructs.dev?ff-generalAvailability`.
  const params = new URLSearchParams(search);
  const flags: any = config.featureFlags ?? {};
  config.featureFlags = flags;

  for (const key of params.keys()) {
    if (key.startsWith("ff-")) {
      const flagName = key.slice(3);
      flags[flagName] = true;
    }
  }

  return (
    <ConfigContext.Provider value={{ ...configResponse, data: config }}>
      {children}
    </ConfigContext.Provider>
  );
};
