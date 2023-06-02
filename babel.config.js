module.exports = function (api) {
  api.cache.forever();

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ];

  return {
    presets,
  };
};
