const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.js', 'jsx', '.ios.js', '.android.js'],
        alias: {
          '@orderbook/common': path.resolve(__dirname, '../common/src/'),
          '@orderbook/common/providers': path.resolve(
            __dirname,
            '../common/src/providers',
          ),
          react: path.resolve(__dirname, './node_modules/react/'),
          'react-dom': path.resolve(__dirname, './node_modules/react-dom/'),
        },
      },
    ],
  ],
};
