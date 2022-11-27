/* eslint-disable */
const fs = require('fs');
const path = require('path');

module.exports = function (scssPath) {
  if (!scssPath) throw new Error('SCSS path required');

  const env = process.env.REACT_APP_APP_NAME || 'alpaca';

  fs.writeFileSync(
    path.resolve(scssPath),
    `// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n\n@import '${env.toLowerCase()}';`,
  );
};
