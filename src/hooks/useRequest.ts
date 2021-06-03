import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseRequestOptions<T> {
  initialValue?: T;
  onError?: (err: Error) => void;
  onSuccess?: (res: T) => void;
}

export interface UseRequestResponse<T> {
  loading: boolean;
  error: Error | undefined;
  data: T | undefined;
}

export type UseRequestReturn<T> = [() => Promise<void>, UseRequestResponse<T>];

/**
 * Provides an API to statefully interact with promises. This hook
 * prevents state updates if promise has not resolved before component unmounts.
 * It will return a tuple with a request() function, and an object representing the state
 */
export function useRequest<T>(
  requestFn: () => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T> {
  const { initialValue, onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | undefined>(initialValue);
  const [error, setError] = useState<Error | undefined>();

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const statefulFetch = useCallback(async () => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(undefined);

    try {
      const res = await requestFn();
      onSuccess?.(res);

      if (mountedRef.current) {
        setData(res);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      onError?.(e);

      if (mountedRef.current) {
        setData(initialValue);
        setError(e);
        setLoading(false);
      }
    }
  }, [onError, onSuccess]);

  return useMemo(
    () => [
      statefulFetch,
      {
        data,
        loading,
        error,
      },
    ],
    [statefulFetch, data, loading, error]
  );
}
