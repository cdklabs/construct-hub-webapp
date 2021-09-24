import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import { App } from "./App";
import { AnalyticsProvider } from "./contexts/Analytics";
import { CardViewProvider } from "./contexts/CardView";
import { CatalogProvider } from "./contexts/Catalog";
import { ConfigProvider } from "./contexts/Config";
import { ExternalLinkWarningProvider } from "./contexts/ExternalLinkWarning";
import { ShortbreadProvider } from "./contexts/Shortbread";
import { Theme } from "./contexts/Theme";
import { register } from "./register-service-worker";
import { reportWebVitals } from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ShortbreadProvider>
        <AnalyticsProvider>
          <ConfigProvider>
            <CatalogProvider>
              <Theme>
                <ExternalLinkWarningProvider>
                  <CardViewProvider>
                    <App />
                  </CardViewProvider>
                </ExternalLinkWarningProvider>
              </Theme>
            </CatalogProvider>
          </ConfigProvider>
        </AnalyticsProvider>
      </ShortbreadProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Register service worker for PWA functionality.
register();
