const { ChakraLoaderPlugin } = require("chakra-loader");

module.exports = {
  devServer: {
    port: 3000,
  },
  configureWebpack: {
    plugins: [new ChakraLoaderPlugin()],
  },
  runtimeCompiler: true,
  transpileDependencies: [/\bvue-awesome\b/],
};
