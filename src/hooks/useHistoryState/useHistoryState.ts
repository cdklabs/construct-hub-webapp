import { useState } from "react";
import { useHistory } from "react-router-dom";

export const useHistoryState = <T>(
  key: string,
  initialValue: T
): [T, (t: T) => void] => {
  const history = useHistory();
  const [rawState, rawSetState] = useState<T>(() => {
    const value = (history.location.state as any)?.[key];
    return value ?? initialValue;
  });
  const setState = (value: T) => {
    history.replace({
      ...history.location,
      state: {
        ...(history.location.state as any),
        [key]: value,
      },
    });
    rawSetState(value);
  };
  return [rawState, setState];
};
