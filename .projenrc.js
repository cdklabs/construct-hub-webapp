const { web } = require("projen");

const project = new web.NextJsTypeScriptProject({
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
  tsconfig: {
    compilerOptions: {
      rootDir: ".",
      target: "es6",
      baseUrl: "src",
      paths: {
        "*": ["*"],
      },
    },
    include: ["src/**/*.ts", "src/**/*.tsx", "pages/**/*.tsx"],
  },

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

  tailwind: false,

  deps: [
    "@chakra-ui/icons",
    "@chakra-ui/react",
    "@emotion/react@^11",
    "@emotion/styled@^11",
    "hast-util-sanitize",
    "@jsii/spec",
    "case",
    "copy-to-clipboard",
    "date-fns",
    "framer-motion@^4",
    "jsii-reflect",
    "prism-react-renderer",
    "react-markdown",
    "rehype-raw",
    "rehype-sanitize",
    "remark-gfm",
  ],

  devDeps: [
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-prefer-arrow",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react",
    "eslint-config-next",
  ],
  autoApproveOptions: {
    allowedUsernames: ["aws-cdk-automation"],
    secret: "GITHUB_TOKEN",
  },
  autoApproveUpgrades: true,
});

(function addJest() {
  project.addDevDeps(
    "jest",
    "babel-jest",
    "ts-node",
    "@testing-library/react",
    "@testing-library/jest-dom",
    "@testing-library/react-hooks",
    "@testing-library/user-event"
  );

  project.addTask("test:unit", {
    exec: "jest",
  });

  project.eslint.addIgnorePattern("jest.config.ts");
})();

(function addCypress() {
  project.addDevDeps("cypress");
  project.eslint.addIgnorePattern("cypress/");
  project.gitignore.addPatterns("cypress/videos/", "cypress/screenshots/");

  project.addTask("cypress:open", {
    exec: "cypress open",
    description: "open the cypress test runner UI",
  });

  project.addTask("cypress:run", {
    exec: "cypress run",
    description: "run the cypress suite in CLI",
  });

  project.addTask("cypress:ci", {
    exec: "next start & npx cypress run && npx kill-port --port 3000",
  });
})();

// Dev Debug Task
project.addTask("dev:debug", {
  exec: "NODE_OPTIONS='--inspect' next dev",
});

project.addTask("next:build", {
  exec: "next build",
});

project.addTask("next:start", {
  exec: "next start",
});

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
const buildTask = project.tasks.tryFind("build");
buildTask.spawn(project.packageTask);

// npm tarball will only include the contents of the "build"
// directory, which is the output of our static website.
project.npmignore.addPatterns("!/build");
project.npmignore.addPatterns("/public");

// test fixtures
project.npmignore.addPatterns("src/__fixtures__");

const fetchAssemblies = project.addTask("dev:fetch-assemblies");
fetchAssemblies.exec(`node scripts/fetch-assemblies.js`);

// these are development assemblies fetched specifically
// by each developer.
project.gitignore.exclude("public/data");

// Proxy requests to awscdk.io for local testing
project.package.addField(
  "proxy",
  "https://construct-hub-testing.dev-tools.aws.dev/"
);

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

// React specific overrides
project.eslint.addOverride({
  files: ["src/**/*.tsx", "src/**/*.ts"],
  extends: [
    "next",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  plugins: ["jsx-a11y", "prefer-arrow"],
  rules: {
    "react/jsx-sort-props": ["warn"],
    "react/react-in-jsx-scope": ["off"],
    "react/prop-types": ["off"],
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        singleReturnOnly: false,
      },
    ],
  },
});

project.buildTask.reset();

project.buildTask.exec("npx projen");
project.buildTask.spawn(project.tasks.tryFind("eslint"));
project.buildTask.spawn(project.tasks.tryFind("next:build"));
project.buildTask.spawn(project.tasks.tryFind("cypress:ci"));
project.buildTask.spawn(project.tasks.tryFind("package"));

project.synth();
