const analyzeExports = require("ts-unused-exports").default;
const path = require("path");

const tsconfig = path.join(__dirname, "..", "tsconfig.json");

const results = Object.entries(
  analyzeExports(tsconfig, ["--allowUnusedTypes"])
);

const underline = "\x1b[4m";
const green = "\x1b[32m";
const yellow = "\x1b[33m%s\x1b[0m";
const reset = "\x1b[0m";

results.forEach(([path, info]) => {
  console.log("\n\n");
  console.log(underline, path, reset);
  console.table(info);
});

const { files, unusedExports } = results.reduce(
  (acc, [, unusedExports]) => {
    acc.files += 1;
    acc.unusedExports += unusedExports.length;

    return acc;
  },
  { files: 0, unusedExports: 0 }
);

console.log("\n")
console.log(unusedExports > 0 ? yellow : green, `Found ${unusedExports} unused exports in ${files} files`);
