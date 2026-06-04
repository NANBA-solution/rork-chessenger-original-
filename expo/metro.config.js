const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withRorkMetro } = require("@rork-ai/toolkit-sdk/metro");

const config = getDefaultConfig(__dirname);

const shimPath = path.resolve(__dirname, "rork-error-shim.ts");
const prevGetBeforeMain =
  config.serializer?.getModulesRunBeforeMainModule ?? (() => []);

config.serializer = {
  ...config.serializer,
  getModulesRunBeforeMainModule: () => [shimPath, ...prevGetBeforeMain()],
};

module.exports = withRorkMetro(config);
