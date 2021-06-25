import { act, renderHook } from "@testing-library/react-hooks";
import { useRequest } from "./useRequest";

describe("useRequest", () => {
  let resolve: () => void;
  let reject: () => void;

  afterEach(jest.clearAllMocks);

  const testRequest = async <T>(val: T): Promise<T> => {
    return new Promise<T>((res, rej) => {
      resolve = () => {
        res(val);
      };

      reject = () => {
        rej(new Error("test promise failed"));
      };
    });
  };

  test("provides a loading state while request is pending", async () => {
    const { result } = renderHook(() => useRequest(testRequest));

    act(() => {
      const [request] = result.current;
      void request("foo");
    });

    const [, state] = result.current;
    expect(state.loading).toBe(true);
  });

  test("returned state updates with resolved value", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useRequest(testRequest)
    );

    act(() => {
      const [request] = result.current;
      void request("foo");
      resolve();
    });

    await waitForNextUpdate();
    const [, state] = result.current;
    expect(state.data).toEqual("foo");
    expect(state.loading).toBe(false);
  });

  test("returned state provides error if promise rejects", async () => {
    // The error handling logs, but we don't need this output to bloat the test output
    jest.spyOn(console, "error").mockImplementation(() => {});

    const { result, waitForNextUpdate } = renderHook(() =>
      useRequest(testRequest)
    );

    act(() => {
      const [request] = result.current;
      void request("foo");
      reject();
    });

    await waitForNextUpdate();
    const [, state] = result.current;

    expect(console.error).toHaveBeenCalled();
    expect(state.error?.message).toEqual("test promise failed");
    expect(state.loading).toBe(false);
  });

  test("State updates on unmounted component will not occur", async () => {
    const { result, unmount } = renderHook(() => useRequest(testRequest));

    act(() => {
      const [request] = result.current;
      void request("foo");
    });

    expect(result.current[1].loading).toBe(true);

    unmount();
    resolve();

    expect(result.current[1].data).toBeUndefined();
  });
});
