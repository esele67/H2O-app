module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // expo-router plugin should be included for routing support
      'expo-router/babel',
      // Keep react-native-reanimated plugin last as required by the library
      'react-native-reanimated/plugin',
    ],
  };
};
