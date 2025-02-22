module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./app'],
        alias: {
          app: './app',
          underscore: 'lodash',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.json', '.ts', '.tsx'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
