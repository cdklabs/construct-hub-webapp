import { act, cleanup, renderHook } from "@testing-library/react-hooks";
import { useDebounce } from "./useDebounce";

const waitFor = (delay: number) => new Promise((res) => setTimeout(res, delay));

describe("useDebounce", () => {
  const onChange = jest.fn();

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it("debounces updates to value", async () => {
    let value = "Hello";
    const { result, rerender } = renderHook(() =>
      useDebounce(value, { delay: 250 })
    );

    await act(async () => {
      value = "World";
      rerender();
      expect(result.current).toEqual("Hello");
      await waitFor(500);
    });

    expect(result.current).toEqual(value);
  });

  it("debounces calls to optional onChange callback", async () => {
    let value = "Hello";
    const { rerender } = renderHook(() => useDebounce(value, { onChange }));

    await act(async () => {
      value = "World";
      rerender();
      expect(onChange).not.toHaveBeenCalled();
      await waitFor(500);
    });

    expect(onChange).toHaveBeenCalledWith(value);
  });
});
