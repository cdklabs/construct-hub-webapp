module.exports = {
  serverRuntimeConfig: {
    apiUrl: "https://construct-hub-testing.dev-tools.aws.dev"
  },
  eslint: {
    // We already run eslint during our build with projen, running again with next is redundant
    ignoreDuringBuilds: true,
  }
}