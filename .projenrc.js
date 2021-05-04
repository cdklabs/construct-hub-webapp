const { web } = require('projen');

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'construct-hub-webapp',
  projenUpgradeSecret: 'CDK_AUTOMATION_GITHUB_TOKEN',

  // since this is an app project, we need to enable these explicitly 
  // in order to be able to publish this as an npm module.
  releaseToNpm: true,
  releaseWorkflow: true,
  package: true,
});

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
project.tasks.tryFind('build').prependExec('npx projen');

// npm tarball will only include the contents of the "build" 
// directory, which is the output of our static website.
project.npmignore?.addPatterns('!/build');
project.npmignore?.addPatterns('/public');

project.synth();
