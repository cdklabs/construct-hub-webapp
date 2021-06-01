/**
 * Override CRA configuration without needing to eject.
 *
 * @see https://www.npmjs.com/package/react-app-rewired
 */
module.exports = function override(config, env) {
  config = ignoreContext(config);
  return config;
}

/**
 * This is needed because of:
 *
 *  - ./node-modules/jsii-reflect/type-system.js has these violations.
 *
 * @see https://webpack.js.org/configuration/module/#module-contexts
 */
function ignoreContext(config) {
  // ignore just-in-time require statements
  config.module.unknownContextCritical = false;

  // ignore require statements that accept an expression (as opposed to a literal)
  config.module.exprContextCritical = false;
  return config;
}