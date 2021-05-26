const { web } = require("projen");

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

  deps: ["react-router-dom"],

  devDeps: ["@types/react-router-dom"],
});

function addStorybook() {
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
  });

  project.addTask("build-storybook", {
    exec: "build-storybook -s public",
  });

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
}

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
const build = project.tasks.tryFind("build");
build.prependExec("npx projen");
build.spawn(project.packageTask);

// npm tarball will only include the contents of the "build"
// directory, which is the output of our static website.
project.npmignore?.addPatterns("!/build");
project.npmignore?.addPatterns("/public");

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
addStorybook();

project.synth();
