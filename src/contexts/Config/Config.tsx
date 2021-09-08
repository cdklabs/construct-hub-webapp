import { createContext, FunctionComponent, useContext, useEffect } from "react";
import { fetchConfig, Config } from "../../api/config";
import { useRequest, UseRequestResponse } from "../../hooks/useRequest";

const ConfigContext = createContext<UseRequestResponse<Config>>({
  loading: false,
  data: undefined,
  error: undefined,
});

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: FunctionComponent = ({ children }) => {
  const [requestConfig, configResponse] = useRequest(fetchConfig);

  useEffect(() => {
    void requestConfig();
  }, [requestConfig]);

  return (
    <ConfigContext.Provider value={configResponse}>
      {children}
    </ConfigContext.Provider>
  );
};
