module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@modules': './src/modules',
          '@core': './src/core',
        },
      },
    ],
    ['@babel/plugin-transform-typescript', { allowDeclareFields: true }],
  ],
};
