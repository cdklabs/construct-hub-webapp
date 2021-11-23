# Construct Hub Web App

This project maintains the React web app for the [Construct Hub].

[construct hub]: https://github.com/cdklabs/construct-hub

## Configuration

Feature flags are used to test new features. You can enable them on your local build by adding a file named `config.json` to the `public/` directory:

```
{
  "featureFlags": {
    "homeRedesign": true,
    "searchRedesign": true
  }
}
```

The list of all configuration options and feature flags is defined in `src/api/config/index.ts`.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.

