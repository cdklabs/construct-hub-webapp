const { web } = require("projen");
const { workflows } = require("projen/lib/github");

const PROXY_URL = "https://constructs.dev/";

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: "main",
  name: "construct-hub-webapp",
  projenUpgradeSecret: "PROJEN_GITHUB_TOKEN",

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

  minNodeVersion: "16.0.0",

  eslint: true,
  eslintOptions: {
    prettier: true,
  },

  deps: [
    "@chakra-ui/anatomy",
    "@chakra-ui/icons",
    "@chakra-ui/react",
    "@chakra-ui/theme-tools",
    "@emotion/react@^11",
    "@emotion/styled@^11",
    "hast-util-sanitize",
    "@jsii/spec",
    "copy-to-clipboard", // Used by Chakra-UI, included for testing
    "date-fns",
    "framer-motion@^4",
    "jsii-reflect",
    "lunr",
    "node-emoji",
    "prism-react-renderer",
    "react-query",
    "react-helmet",
    "react-markdown",
    "react-router-dom",
    "rehype-raw",
    "rehype-sanitize",
    "remark-emoji",
    "remark-gfm",
    "semver",
    "spdx-license-list",
    // PWA Functionality
    "workbox-core",
    "workbox-expiration",
    "workbox-precaching",
    "workbox-routing",
    "workbox-strategies",
  ],

  devDeps: [
    "@types/lunr",
    "@types/node-emoji",
    "@types/react-helmet",
    "@types/react-router-dom",
    "@types/semver",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-prefer-arrow",
    "eslint-plugin-react-hooks",
    "eslint-plugin-react",
    "react-app-rewired",
  ],

  autoApproveOptions: {
    allowedUsernames: ["cdklabs-automation"],
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

  // Express is used to create a local proxy server used in CI + local build testing
  (function addExpress() {
    project.addDevDeps("express", "express-http-proxy");
    project.addTask("proxy-server", {
      exec: "node ./scripts/proxy-server",
    });

    project.addTask("proxy-server:ci", {
      exec: "npx react-app-rewired build && yarn proxy-server",
    });
  })();

  const cypressRunSteps = [
    {
      name: "Checkout",
      uses: "actions/checkout@v2",
    },
    {
      name: "Cypress Run",
      uses: "cypress-io/github-action@v2",
      with: {
        start: "yarn proxy-server:ci",
        "wait-on": "http://localhost:3000",
        "wait-on-timeout": 150,
      },
    },
    {
      uses: "actions/upload-artifact@v2",
      if: "failure()",
      with: {
        name: "cypress-screenshots",
        path: "cypress/screenshots",
      },
    },
    {
      uses: "actions/upload-artifact@v2",
      if: "always()",
      with: {
        name: "cypress-videos",
        path: "cypress/videos",
      },
    },
  ];

  const integWorkflow = project.github.addWorkflow("integ");
  integWorkflow.on({ workflowDispatch: {}, pullRequest: {} });
  integWorkflow.addJob("e2e", {
    name: "e2e",
    runsOn: "ubuntu-latest",
    permissions: {
      checks: "write",
      contents: "read",
    },
    steps: cypressRunSteps,
  });

  // Set up a canary that tests that the latest code on our main branch
  // works against data on https://constructs.dev.
  //
  // We need to use the version of the front-end from the main branch
  // and not the version that is live, otherwise it's possible for newer
  // tests to run against an older (incompatible) version of the frontend
  // due to deployment delays and give us false positives.
  const e2eCanary = project.github.addWorkflow("e2e-canary");
  e2eCanary.on({
    schedule: [
      {
        cron: "0 */3 * * *", // run every three hours
      },
    ],
    workflowDispatch: {},
  });
  e2eCanary.addJobs({
    test: {
      name: "constructs.dev canary",
      runsOn: "ubuntu-latest",
      permissions: {
        checks: "write",
        contents: "read",
      },
      steps: [
        ...cypressRunSteps,
        {
          name: "Create failure issue",
          if: "failure()",
          uses: "imjohnbo/issue-bot@v3",
          with: {
            labels: "failed-release",
            title: `E2E Canary for https://constructs.dev failed.`,
            body: "See https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}",
          },
          env: {
            GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
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

  project.addTask("test:update", {
    exec: "npx react-app-rewired test -u",
  });

  project.eslint.addIgnorePattern("jest.config.ts");
})();

// This task is used to analyze dead code
(function addAnalyzeExports() {
  project.addDevDeps("ts-unused-exports");
  project.addTask("analyze-exports", { exec: "node scripts/analyze-exports" });
})();

// npm tarball will only include the contents of the "build"
// directory, which is the output of our static website.
project.npmignore.addPatterns("!/build");
project.npmignore.addPatterns("/public");

// Ignore local config.json
project.npmignore.addPatterns("/build/config.json");
project.gitignore.addPatterns("/public/config.json");

// test fixtures
project.npmignore.addPatterns("src/__fixtures__");

// these are development assemblies fetched specifically
// by each developer.
project.gitignore.exclude("public/data");

// Proxy requests to awscdk.io for local testing
project.package.addField("proxy", PROXY_URL);

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
    "@typescript-eslint/no-use-before-define": ["error"],
    "no-use-before-define": "off",
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        singleReturnOnly: false,
      },
    ],
    "react/jsx-sort-props": ["warn"],
    "react/prop-types": ["off"],
    "react/react-in-jsx-scope": ["off"],
  },
});

// rewire cra tasks, all apart from eject.
rewireCRA(project.tasks.tryFind("build"));
rewireCRA(project.tasks.tryFind("test"));
rewireCRA(project.tasks.tryFind("dev"));

// trigger construct-hub to pick up changes from construct-hub-webapp
// whenever a new release is made
project.release.addJobs({
  upgrade_construct_hub: {
    name: "Upgrade construct-hub",
    runsOn: "ubuntu-latest",
    permissions: {
      actions: workflows.JobPermission.WRITE,
    },
    needs: ["release", "release_github", "release_npm"],
    steps: [
      {
        name: "Trigger upgrade workflow",
        run: 'gh api -X POST /repos/cdklabs/construct-hub/actions/workflows/upgrade-main.yml/dispatches --field ref="main"',
        env: {
          GITHUB_TOKEN: "${{ secrets.PROJEN_GITHUB_TOKEN }}",
        },
      },
    ],
  },
});

// replace default service worker script with no-op worker
const replaceWorker = project.addTask("replace-worker");
replaceWorker.exec("cp src/no-op-sw.js build/service-worker.js");
replaceWorker.exec("rm build/service-worker.js.map");
project.compileTask.spawn(replaceWorker);

project.synth();

/**
 * Rewire a create-react-app task to use 'react-app-rewired` instead of 'react-scripts'
 * so that our configuration overrides will take affect.
 *
 * @see https://www.npmjs.com/package/react-app-rewired
 */
function rewireCRA(craTask) {
  for (const step of craTask.steps) {
    if (step.exec && step.exec.startsWith("react-scripts")) {
      step.exec = step.exec.replace("react-scripts", "react-app-rewired");
    }
  }
}
