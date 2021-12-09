import type { ClickEventConfig } from "./types";

export const eventName = (...args: string[]) => args.join(" | ");

export const clickEvent = (
  params: Omit<ClickEventConfig["event"], "type">
): ClickEventConfig => ({
  event: {
    ...params,
    type: "click",
  },
});
