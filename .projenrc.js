const { web, SourceCode } = require("projen");

// some assemblies we fetch during development
// so we'll have data to work with on the package page.
const devAssemblies = {
  "@aws-cdk/aws-ecr": ["1.106.0"],
};

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
    "react-router-dom",
    "jsii-reflect",
    "@jsii/spec",
    "codemaker",
    "@uiw/react-markdown-preview",
  ],

  devDeps: ["@types/react-router-dom"],
});

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
const build = project.tasks.tryFind("build");
build.prependExec("npx projen");
build.spawn(project.packageTask);

// npm tarball will only include the contents of the "build"
// directory, which is the output of our static website.
project.npmignore.addPatterns("!/build");
project.npmignore.addPatterns("/public");

codeGenFetchAssemblies();

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
  const scriptPath = "scripts/fetch-dev-assemblies.js";

  const packagesPath = "public/packages";

  const script = new SourceCode(project, scriptPath);
  script.line(fetchAssembly.toString());

  for (const [name, versions] of Object.entries(devAssemblies)) {
    for (const version of versions) {
      script.line(
        `${fetchAssembly.name}('${name}', '${version}', '${packagesPath}')`
      );
    }
  }

  project.gitignore.exclude(packagesPath);

  const task = project.addTask("dev:fetch-assemblies");
  task.exec(`node ${scriptPath}`);

  const dev = project.tasks.tryFind("dev");
  dev.prependSpawn(task);
}

function fetchAssembly(packageName, packageVersion, packagesPath) {
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
