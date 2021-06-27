const path = require('path');
const toPath = _path => path.join(process.cwd(), _path);
const { removeModuleScopePlugin } = require('customize-cra');

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

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-create-react-app'],
  babel: async options => {
    return {
      ...options,
      plugins: [
        ...options.plugins,
        [
          '@emotion',
          {
            sourceMap: true,
            autoLabel: 'dev-only',
            labelFormat: '[local]',
            cssPropOptimization: true,
          },
        ],
      ],
    };
  },
  managerWebpack: async config => {
    return {
      ...enableTypescriptImportsFromExternalPaths([path.resolve(__dirname, '../../common/src')])(
        removeModuleScopePlugin()(config),
      ),
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@orderbook/common': path.resolve(__dirname, '../../common/src'),
        },
      },
    };
  },
  webpackFinal: async config => {
    return {
      ...enableTypescriptImportsFromExternalPaths([path.resolve(__dirname, '../../common/src')])(
        removeModuleScopePlugin()(config),
      ),
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/css': toPath('node_modules/@emotion/css'),
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
          '@emotion/styled': toPath('node_modules/@emotion/styled'),
          '@orderbook/common': path.resolve(__dirname, '../../common/src'),
        },
      },
    };
  },
  typescript: {
    reactDocgen: 'none',
  },
};
