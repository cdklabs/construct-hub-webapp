import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
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

  return (
    <ConfigContext.Provider value={{ ...configResponse, data: configData }}>
      {children}
    </ConfigContext.Provider>
  );
};
