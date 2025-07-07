module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/screens': './src/screens',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/constants': './src/constants',
          '@/types': './src/types',
          '@/hooks': './src/hooks',
          '@/store': './src/store',
          '@/navigation': './src/navigation',
          '@/assets': './assets',
          '@/splash': './src/splash',
          '@/login': './src/login',
          '@/home': './src/home',
          '@/list': './src/list',
          '@/about': './src/about',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
