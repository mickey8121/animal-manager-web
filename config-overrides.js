const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const writeEnvScss = require('./scripts/write-env-scss.js');

writeEnvScss('./src/styles/variables/_env.scss');

module.exports = function override(config, env) {
  // New config, e.g. config.plugins.push...

  config.plugins.push(
    //The CopyPlugin plugin replaces the variables enclosed between the % character with the variables taken from the environment in the manifest.json file
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/manifest.json'),
          transform(content, path) {
            return content
              .toString()
              .replace(/%\w+%/g, m => process.env[m.slice(1, m.length - 1)] || '');
          },
        },
      ],
    }),
  );

  return config;
};
