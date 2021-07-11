import type { ShortbreadOptions } from "./shortbread";

const isDev = process.env.NODE_ENV === "development";

/**
 * This function allows for shortbread testing locally.
 * If the node env is dev and the url has a query param of sb=true,
 * it will return a __storeWriter function to pass into shortbread's options
 */
export const getLocalStoreWriter = (): ShortbreadOptions["__storeWriter"] => {
  const search = new URLSearchParams(window.location.search);
  const shouldUseOverride = search.get("sb") === "true";

  if (isDev && shouldUseOverride) {
    return (cookie) => {
      document.cookie = cookie.replace(" secure=true;", "");
    };
  }

  return undefined;
};
