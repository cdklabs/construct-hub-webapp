import { Config } from "api/config";

declare global {
  // Extend the window interface for additional properties
  interface Window {
    configOverride?: Config;
  }
}
