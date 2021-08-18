const { web } = require("projen");

const project = new web.NextJsTypeScriptProject({
  defaultReleaseBranch: "main",
  name: "construct-hub-webapp",
  projenUpgradeSecret: "CDK_AUTOMATION_GITHUB_TOKEN",

  // Author metadata
  authorEmail: "construct-ecosystem-team@amazon.com",
  authorName: "Amazon Web Services, Inc.",

  npmignore: ["!/src", "!/.projenrc.js", "!/tsconfig.json", "/**/.test.ts"],

  // Repository information
  repository: "https://github.com/cdklabs/construct-hub-webapp.git",

  // since this is an app project, we need to enable these explicitly
  // in order to be able to publish this as an npm module.
  releaseToNpm: true,
  releaseWorkflow: true,
  sampleCode: false,
  tsconfig: {
    compilerOptions: {
      rootDir: ".",
      target: "es6",
      baseUrl: "src",
      paths: {
        "*": ["*"],
      },
    },
    include: ["src/**/*.ts", "src/**/*.tsx"],
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

  project.npmignore.addPatterns("src/__fixtures__", "jest.config.js");
  project.eslint.addIgnorePattern("jest.config.ts");
})();

(function addCypress() {
  project.addDevDeps("cypress");
  project.eslint.addIgnorePattern("cypress/");
  project.npmignore.addPatterns("cypress/");
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

(function addNextTasks() {
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
})();

(function addLintScripts() {
  project.addTask("lint", {
    exec: "eslint --ext .ts,.tsx --fix --no-error-on-unmatched-pattern pages src .projenrc.js",
  });

  project.addTask("tsc", {
    exec: "tsc",
  });
})();

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
project.buildTask.spawn(project.tasks.tryFind("tsc"));
project.buildTask.spawn(project.tasks.tryFind("lint"));
project.buildTask.spawn(project.tasks.tryFind("test:unit"));
project.buildTask.spawn(project.tasks.tryFind("next:build"));
project.buildTask.spawn(project.tasks.tryFind("cypress:ci"));

project.synth();
