const { web } = require('projen');

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'construct-hub-webapp',
  projenUpgradeSecret: 'CDK_AUTOMATION_GITHUB_TOKEN',
});

project.synth();
