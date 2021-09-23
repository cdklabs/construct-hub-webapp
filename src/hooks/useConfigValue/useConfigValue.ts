import type { Config } from "../../api/config";
import { useConfig } from "../../contexts/Config";

export const useConfigValue = <T extends keyof Config>(key: T) => {
  const { data } = useConfig();
  return (data ?? {})[key];
};
