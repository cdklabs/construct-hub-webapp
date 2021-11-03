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

const buildDir = path.join(__dirname, "build");

app.use(express.static(buildDir));

app.use(
  proxy(proxyUrl, {
    filter: (req) => req.url.includes(".json") || req.url.includes(".md"),
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port);

console.log("Proxy server started on port ", port);
