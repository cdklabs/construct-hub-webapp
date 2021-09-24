import { Config } from "../api/config";
import type { AWSMA } from "./AWSMA";

declare global {
  // Extend the window interface for additional properties
  interface Window {
    AWSMA: AWSMA;

    configOverride?: Config;
  }
}
