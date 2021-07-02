import { getLocalStoreWriter } from "./getLocalStoreWriter";

export interface ShortbreadOptions {
  domain?: string;
  parent?: HTMLElement;
  language?: Navigator["language"];
  __storeWriter?: (cookie: Document["cookie"]) => void;
}

export interface Shortbread {
  /**
   * Call this function to be notified when you cookie category is allowed
   */
  access: (
    name: "essential" | "performance" | "functional" | "advertising",
    onAllowed: () => void
  ) => void;
  /**
   * Call to ask the user the type of cookies they'd like to receive
   */
  checkForCookieConsent: () => void;
  /**
   * Open the Customize Cookie Dialog
   */
  customizeCookies: () => void;
  /**
   * Returns the consent cookie or undefined if not yet set
   */
  getConsentCookie: () => Document["cookie"] | undefined;
  /**
   * Call this to ask if the cookie has been set
   */
  hasConsent: (cookieName: string) => boolean;
}

// We only want to manage a single instance at a time
let instance: Shortbread | undefined;

/**
 * Call to initialize the shortbread instance. Must be called before all other methods
 */
export const initialize = async () => {
  return new Promise<void>((resolve, reject) => {
    // Wait until page has loaded first
    window.addEventListener("load", async () => {
      try {
        const options: ShortbreadOptions = {
          domain: window.location.hostname,
          language: navigator.language,
          __storeWriter: getLocalStoreWriter(),
        };

        // Import the shortbread source
        const { AWSCShortbread } = await import("./source");
        instance = AWSCShortbread(options);

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
};

// Shortbread wrappers

const callIfDefined =
  <T extends keyof Shortbread>(method: T) =>
  (...args: Parameters<Shortbread[T]>): ReturnType<Shortbread[T]> => {
    if (!instance) {
      throw new Error("shortbread has not been initialized");
    }

    const shortbreadMethod = instance[method];
    // TODO: figure out how to properly annotate this internal to the function.
    // Annotations are correct for consumers
    return (shortbreadMethod as any)(...args);
  };

/**
 * Call this function to be notified when you cookie category is allowed
 */
export const access = callIfDefined("access");
/**
 * Call to ask the user the type of cookies they'd like to receive
 */
export const checkForCookieConsent = callIfDefined("checkForCookieConsent");
/**
 * Open the Customize Cookie Dialog
 */
export const customizeCookies = callIfDefined("customizeCookies");
/**
 * Returns the consent cookie or undefined if not yet set
 */
export const getConsentCookie = callIfDefined("getConsentCookie");
/**
 * Call this to ask if the cookie has been set
 */
export const hasConsent = callIfDefined("hasConsent");
