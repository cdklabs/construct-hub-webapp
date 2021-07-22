
export interface AWSMA {
  config: {
    customPageView: true;
  };
  ready: (callback: () => void) => void;
  TRIGGER_EVENT: "custom_awsma_trigger";
}