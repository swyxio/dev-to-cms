// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const path = require("path");
// const APP_DIR = path.resolve(__dirname, "./src");
// const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");
// const withCSS = require("@zeit/next-css");
// module.exports = withCSS({
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

    // // from docs https://github.com/react-monaco-editor/react-monaco-editor
    // // otherwise "Global CSS cannot be imported from within node_modules." error
    // config.module.rules.push({
    //   test: /\.css$/,
    //   exclude: /node_modules/,
    //   use: [
    //     {
    //       loader: "style-loader"
    //     },
    //     {
    //       loader: "css-loader",
    //       options: {
    //         importLoaders: 1
    //       }
    //     },
    //     {
    //       loader: "postcss-loader"
    //     }
    //   ]
    // });
    // config.module.rules.push({
    //   test: /\.css$/,
    //   include: MONACO_DIR,
    //   use: ["style-loader", "css-loader"]
    // });
    return config;
  }
};
