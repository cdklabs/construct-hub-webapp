const { SourceCode, web } = require("projen");

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
  tsconfig: {
    compilerOptions: {
      target: "es6",
    },
  },

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

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
    "react-router-dom",
    "rehype-raw",
    "rehype-sanitize",
    "remark-gfm",
    // PWA Functionality
    "workbox-core",
    "workbox-expiration",
    "workbox-precaching",
    "workbox-routing",
    "workbox-strategies",
  ],

  devDeps: [
    "@types/react-router-dom",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-prefer-arrow",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react",
    "react-app-rewired",
  ],
  autoApproveOptions: {
    allowedUsernames: ["aws-cdk-automation"],
    secret: "GITHUB_TOKEN",
  },
  autoApproveUpgrades: true,
});

(function addCypress() {
  project.addDevDeps("cypress");

  project.addTask("cypress:open", {
    exec: "cypress open",
    description: "open the cypress test runner UI",
  });

  project.addTask("cypress:run", {
    exec: "cypress run",
    description: "run the cypress suite in CLI",
  });

  project.gitignore.addPatterns("cypress/videos/", "cypress/screenshots/");
  project.eslint.addIgnorePattern("cypress/");

  project.buildWorkflow.addJobs({
    cypress: {
      runsOn: "ubuntu-latest",
      permissions: {
        checks: "write",
        contents: "read",
      },
      steps: [
        {
          name: "Checkout",
          uses: "actions/checkout@v2",
        },
        {
          name: "Cypress Run",
          uses: "cypress-io/gitub-action@v2",
          with: {
            start: "yarn dev",
            "wait-on": "localhost:3000",
          },
        },
      ],
    },
  });
})();

(function addJest() {
  project.addDevDeps(
    // "jest",
    // "babel-jest",
    // "ts-node",
    "@testing-library/react",
    "@testing-library/jest-dom",
    "@testing-library/react-hooks",
    "@testing-library/user-event"
  );

  project.addTask("test:unit", {
    // exec: "jest",
    exec: "npx react-app-rewired test",
  });

  project.eslint.addIgnorePattern("jest.config.ts");
})();

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

// rewire cra tasks, all apart from eject.
rewireCRA(buildTask);
rewireCRA(project.tasks.tryFind("test"));
rewireCRA(project.tasks.tryFind("dev"));
addBuildConfig();

project.synth();

/**
 * Rewire a create-react-app task to use 'react-app-rewired` instead of 'react-scripts'
 * so that our configuration overrides will take affect.
 *
 * @see https://www.npmjs.com/package/react-app-rewired
 */
function rewireCRA(craTask) {
  for (const step of craTask.steps) {
    if (step.exec?.startsWith("react-scripts")) {
      step.exec = step.exec.replace("react-scripts", "react-app-rewired");
    }
  }
}

/**
 * Add build time configuration values for react-scripts.
 * Use an `.env.local` file to override for local development.
 */
function addBuildConfig() {
  project.gitignore?.addPatterns(".env.local");

  const config = new SourceCode(project, ".env");
  // Remove inline scripts to allow strict CSP policy.
  config.line("INLINE_RUNTIME_CHUNK=false");
}
