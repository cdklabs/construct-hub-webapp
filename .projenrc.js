const { web, SourceCode, FileBase } = require("projen");

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: "main",
  name: "construct-hub-webapp",
  projenUpgradeSecret: "CDK_AUTOMATION_GITHUB_TOKEN",

  // Author metadata
  authorEmail: "construct-ecosystem-team@amazon.com",
  authorName: "Amazon Web Services, Inc.",

  // Repository information
  repository: "https://github.com/cdklabs/construct-hub-webapp.git",

  // since this is an app project, we need to enable these explicitly
  // in order to be able to publish this as an npm module.
  releaseToNpm: true,
  releaseWorkflow: true,
  package: true,

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

  deps: [
    "@chakra-ui/react",
    "@emotion/react@^11",
    "@emotion/styled@^11",
    "chakra-ui-markdown-renderer",
    "framer-motion@^4",
    "react-router-dom",
    "@uiw/react-markdown-preview",
    "jsii-reflect",
    "@jsii/spec",
    "codemaker",
  ],

  devDeps: ["@types/react-router-dom"],
});

(function addStorybook() {
  project.addDevDeps(
    "@storybook/addon-actions",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@storybook/node-logger",
    "@storybook/preset-create-react-app",
    "@storybook/react",
    "babel-loader@8.1.0"
  );

  // Add tasks and config for storybook
  project.addTask("storybook", {
    exec: "start-storybook -p 6006 -s public",
    description: "run local storybook server",
  });

  const buildTask = project.addTask("storybook:build", {
    exec: "build-storybook -s public",
    description: "build storybook static site assets",
  });
  project.compileTask.prependSpawn(buildTask);

  project.eslint.addOverride({
    files: ["**/*.stories.*"],
    rules: {
      "import/no-anonymous-default-export": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: ["**/*.stories.*"],
          optionalDependencies: false,
          peerDependencies: true,
        },
      ],
    },
  });

  project.gitignore?.addPatterns("/storybook-static/");
})();

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
const buildTask = project.tasks.tryFind("build");
buildTask.prependSpawn(project.compileTask);
buildTask.prependExec("npx projen");
buildTask.spawn(project.packageTask);

// npm tarball will only include the contents of the "build"
// directory, which is the output of our static website.
project.npmignore.addPatterns("!/build");
project.npmignore.addPatterns("/public");

// assemblies used for tests
project.npmignore.addPatterns("src/__assemblies__");

codeGenFetchAssemblies();

// Proxy requests to awscdk.io for local testing
project.package.addField("proxy", "https://awscdk.io");

// setup linting for create-react-app specific tools
project.eslint.addRules({
  "import/no-extraneous-dependencies": [
    "error",
    {
      devDependencies: ["**/setupTests.ts", "**/*.test.tsx", "**/*.test.ts"],
      optionalDependencies: false,
      peerDependencies: true,
    },
  ],
});

project.synth();

function codeGenFetchAssemblies() {
  const scriptPath = "scripts/fetch-assemblies.js";

  const packagesPath = "public/packages";

  const script = new SourceCode(project, scriptPath);
  script.line(`// ${FileBase.PROJEN_MARKER}`);
  script.line(fetchAssembly.toString());
  script.line(`${fetchAssembly.name}('${packagesPath}')`);

  project.gitignore.exclude(packagesPath);

  const task = project.addTask("dev:fetch-assemblies");
  task.exec(`node ${scriptPath}`);
}

function fetchAssembly(packagesPath) {
  const packageName = process.env.PACKAGE_NAME;
  const packageVersion = process.env.PACKAGE_VERSION;

  if (!packageName) {
    throw new Error(
      `Package name missing. Please provide via 'PACKAGE_NAME' env variable.`
    );
  }

  if (!packageVersion) {
    throw new Error(
      `Package version missing. Please provide via 'PACKAGE_VERSION' env variable`
    );
  }

  const exec = require("child_process").exec;
  const fs = require("fs");
  const os = require("os");
  const path = require("path");

  if (packageVersion.startsWith("^")) {
    packageVersion = packageVersion.substring(1, packageVersion.length);
  }

  const output = `${packagesPath}/${packageName}@${packageVersion}/jsii.json`;

  const tempDir = fs.mkdtempSync(`${os.tmpdir()}/assembly`);
  const assemblyPath = `${__dirname}/../${output}`;
  const package = `${packageName}@${packageVersion}`;

  if (fs.existsSync(assemblyPath)) {
    console.log(`Assembly for ${package} already exists locally`);
    return;
  }

  console.log(`Fetching assembly for ${package}`);
  fs.mkdirSync(path.dirname(assemblyPath), { recursive: true });
  exec(
    `cd ${tempDir} && npm v ${packageName}@${packageVersion} dist.tarball | xargs curl | tar -xz`,
    (error, stdout, stderr) => {
      fs.copyFileSync(path.join(tempDir, "package", ".jsii"), assemblyPath);
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(tempDir, "package", "package.json"))
      );
      for (const [n, v] of Object.entries(
        packageJson.peerDependencies ? packageJson.peerDependencies : {}
      )) {
        fetchAssembly(n, v, packagesPath);
      }
    }
  );
}
