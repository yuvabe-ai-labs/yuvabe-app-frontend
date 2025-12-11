const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const baseConfig = getDefaultConfig(__dirname);
baseConfig.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

baseConfig.resolver.assetExts = baseConfig.resolver.assetExts.filter(
  ext => ext !== 'svg'
);
baseConfig.resolver.sourceExts = [...baseConfig.resolver.sourceExts, 'svg'];

const config = mergeConfig(baseConfig, {});

module.exports = withNativeWind(config, { input: './global.css' });
