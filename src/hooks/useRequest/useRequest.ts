import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Possible utility types for re-use
type PromiseFn = (...args: any[]) => Promise<any>;
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
type AwaitedReturn<T extends PromiseFn> = Awaited<ReturnType<T>>;

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

export type UseRequestReturn<T extends (...args: any[]) => Promise<T>> = [
  (...args: Parameters<T>) => Promise<void>,
  UseRequestResponse<AwaitedReturn<T>>
];

/**
 * Provides an API to statefully interact with promises. This hook
 * prevents state updates if promise has not resolved before component unmounts.
 * It will return a tuple with a request() function, and an object representing the state
 */
export const useRequest = <T extends PromiseFn>(
  requestFn: T,
  options: UseRequestOptions<AwaitedReturn<T>> = {}
): UseRequestReturn<T> => {
  const { initialValue, onSuccess, onError } = options;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AwaitedReturn<T> | undefined>(initialValue);
  const [error, setError] = useState<Error | undefined>();

  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const statefulFetch = useCallback(
    async (...args: Parameters<T>): Promise<void> => {
      if (!mountedRef.current) return;

      setLoading(true);
      setError(undefined);

      try {
        const res = await requestFn(...args);
        onSuccess?.(res);

        if (mountedRef.current) {
          setData(res);
          setLoading(false);
        }
      } catch (e: any) {
        console.error(e);
        onError?.(e);

        if (mountedRef.current) {
          setData(initialValue);
          setError(e);
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onError, onSuccess]
  );

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
};
