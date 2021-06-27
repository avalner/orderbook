/* eslint-disable @typescript-eslint/no-var-requires */
const { override, addBabelPlugins, removeModuleScopePlugin, addWebpackAlias } = require('customize-cra');
const path = require('path');

const enableTypescriptImportsFromExternalPaths = newIncludePaths => webpackConfig => {
  const oneOfRule = webpackConfig.module.rules.find(rule => rule.oneOf);
  if (oneOfRule) {
    const tsxRule = oneOfRule.oneOf.find(rule => rule.test && rule.test.toString().includes('tsx'));

    if (tsxRule) {
      tsxRule.include = Array.isArray(tsxRule.include)
        ? [...tsxRule.include, ...newIncludePaths]
        : [tsxRule.include, ...newIncludePaths];
    }
  }

  return webpackConfig;
};

module.exports = override(
  ...addBabelPlugins([
    '@emotion',
    {
      sourceMap: true,
      autoLabel: 'dev-only',
      labelFormat: '[local]',
      cssPropOptimization: true,
    },
  ]),
  enableTypescriptImportsFromExternalPaths([path.resolve(__dirname, '../common/src/')]),
  addWebpackAlias({
    // force webpack to use the same react and react-dom libraries in web and common projects
    ['react$']: path.resolve(__dirname, './node_modules/react/'),
    ['react-dom$']: path.resolve(__dirname, './node_modules/react-dom/'),
    // alias for common project
    ['@orderbook/common']: path.resolve(__dirname, '../common/src'),
  }),
  removeModuleScopePlugin(),
);
