module.exports = {
  webpack: (config, options) => {
    config.node = {
      fs: "empty"
    };
    // config.plugins.push(
    //   new MonacoWebpackPlugin({
    //     // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    //     languages: [
    //       "json",
    //       "markdown",
    //       "css",
    //       "typescript",
    //       "javascript",
    //       "html",
    //       "graphql",
    //       "python",
    //       "scss",
    //       "yaml"
    //     ]
    //   })
    // );
    return config;
  }
};
