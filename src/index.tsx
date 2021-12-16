import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { App } from "./App";
import { AnalyticsProvider } from "./contexts/Analytics";
import { ConfigProvider } from "./contexts/Config";
import { ExternalLinkWarningProvider } from "./contexts/ExternalLinkWarning";
import { SearchProvider } from "./contexts/Search";
import { ShortbreadProvider } from "./contexts/Shortbread";
import { Theme } from "./contexts/Theme";
import { unregister } from "./register-service-worker";
import { reportWebVitals } from "./reportWebVitals";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ShortbreadProvider>
          <AnalyticsProvider>
            <ConfigProvider>
              <SearchProvider>
                <Theme>
                  <ExternalLinkWarningProvider>
                    <App />
                  </ExternalLinkWarningProvider>
                </Theme>
              </SearchProvider>
            </ConfigProvider>
          </AnalyticsProvider>
        </ShortbreadProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Disable any registered service workers (previously enabled for PWA functionality).
//
// This is disabled due to caching issues where users are not receiving
// the latest versions of content on the first load of the website. This
// occurs because content is being served from the service worker cache.
//
// This should probably not be re-enabled unless we have a mechanism
// in place to automatically content when new versions of the website are
// available.
unregister();
