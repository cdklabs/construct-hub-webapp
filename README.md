# Construct Hub Web App

This project maintains the React web app for the [Construct Hub].

[construct hub]: https://github.com/cdklabs/construct-hub
## :hammer_and_pick: Development

### :clipboard: Prerequisites:

- Node v12 or later
- yarn v1

### :computer: Running the website

To run the web app locally, fork the repository and run `yarn` or `yarn install`
to download its dependencies. Then, run `yarn dev` to start the development
server on localhost:3000.

By default, all requests for backend data will be proxied to
`https://constructs.dev`. To change this to point to a different version of the
website (such as your own deployment of the [Construct Hub
construct](https://github.com/cdklabs/construct-hub), modify the value of
PROXY_URL in the beginning of `.projenrc.js` and then run `yarn projen` to
update the configuration everywhere. You may then need to restart `yarn dev` for
changes to take effect.

### :gear: Configuration

Feature flags are used to test new features. You can enable them on your local
build by adding a file named `config.json` to the `public/` directory:

```
{
  "featureFlags": {
    "homeRedesign": true,
    "searchRedesign": true
  }
}
```

The list of all configuration options and feature flags is defined in
`src/api/config/index.ts`.

### :test_tube: Running integration / E2E tests

Integration tests are written using Cypress and can be found within the
`cypress/` directory. The full test suite can be executed in the CLI by running
`yarn cypress:run`, or you can run `yarn cypress:open` to debug individual tests
interactively.

### :toolbox: Other tools

Our repository has a GitHub action set up to automatically update minor and
patch versions of dependencies. To update the major version of a dependency,
change the version directly in `package.json` and install it with `yarn` so that
`yarn.lock` is updated. If you need to add a new dependency, find the section of
`.projenrc.js` where the dependencies (or dev dependencies) are located, add the
dependency name, and run `yarn projen`.

The `yarn analyze-exports` command can be used to automatically generate a list
of TypeScript exports that are not being used within the app.

## :cop: Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more
information.

## :balance_scale: License

This project is licensed under the Apache-2.0 License.
