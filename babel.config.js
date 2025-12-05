module.exports = {
  presets: ['module:@react-native/babel-preset','nativewind/babel'],
  plugins: [
    // Reanimated plugin must be listed last
    'react-native-reanimated/plugin',
    '@babel/plugin-transform-export-namespace-from',
  ],
};
