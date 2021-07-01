import { useState, useEffect } from "react";

export interface UseDebounceOptions<T> {
  delay?: number;
  onChange?: (val: T) => void;
}

export const useDebounce = <T>(
  value: T,
  options: UseDebounceOptions<T> = {}
) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const { delay = 250, onChange } = options;

  useEffect(() => {
    // Update value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      onChange?.(value);
    }, delay);

    // Cancel timeout when value / delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, onChange]);

  return debouncedValue;
};
