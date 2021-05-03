const { web } = require('projen');

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'construct-hub-webapp',
  projenUpgradeSecret: 'CDK_AUTOMATION_GITHUB_TOKEN',
});

// synthesize project files before build
// see https://github.com/projen/projen/issues/754
project.tasks.tryFind('build').prependExec('npx projen');

project.synth();
