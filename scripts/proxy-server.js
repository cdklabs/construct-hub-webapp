/**
 * @fileoverview A simple proxy server to test the locally built webapp against real data.
 * This is only intended for local testing + testing in CI
 */
const express = require("express");
const path = require("path");
const proxy = require("express-http-proxy");
const proxyUrl = require("../package.json").proxy;

const app = express();
const port = process.env.PORT || 3000;
const isCI = process.env.CI;

const buildDir = path.join(__dirname, "..", "build");

const PROXY_FILES = [".json", ".md", "preload.js"];

// In CI runs, replace the preload script that contains analytics with a stub
// Analytics can cause transient errors when the browser is automated.
// This must be registered before the proxy, otherwise the proxy serves the real script.
if (isCI) {
  app.get("/preload.js", (req, res) => {
    res.set("Content-Type", "text/javascript");
    res.send("// Empty file for CI test runs");
  });
}

app.use(express.static(buildDir));

app.use(
  proxy(proxyUrl, {
    filter: (req) => PROXY_FILES.some((file) => req.url.includes(file)),
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port);

console.log("Proxy server started on port ", port);
