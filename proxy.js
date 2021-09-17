const express = require("express");
const path = require("path");
const proxy = require("express-http-proxy");
const proxyUrl = require("./package.json").proxy;

const app = express();
const port = process.env.PORT || 3100;

const buildDir = path.join(__dirname, "build");

app.use(express.static(buildDir));

app.use(proxy(proxyUrl));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildDir, "index.html"));
});

app.listen(port);

console.log("Proxy server started on port ", port);
