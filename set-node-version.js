// preinstall script
// Set the version of Node running based on the one set in engines.node from the package.json
const fs = require('fs');
const path = require('path');

const packageJson = require('./package.json');
 
const requiredNodeVersion = packageJson.engines && packageJson.engines.node;

if (!requiredNodeVersion) {
  console.error('Variable engines.node in package.json is required but not set');
  process.exit(1);
}
 
// set .nvmrc and .node_version to have the same version
['.node-version', '.nvmrc'].forEach(
  p => fs.writeFileSync(path.join(__dirname, p), requiredNodeVersion, 'UTF8')
);
