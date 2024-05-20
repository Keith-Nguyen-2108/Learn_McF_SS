const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "learnss",
    projectName: "common-react",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    externals: ["react", "react-dom", "@learnss/react-utils"],
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: { rootMode: "upward" },
            },
            "ts-loader",
          ],
        },
        {
          test: /\.css$/i,
          include: [/node_modules/, /src/],
          use: ["cache-loader", "style-loader", "fast-css-loader"],
        },
        {
          test: /\.scss$/,
          use: [
            "cache-loader",
            "style-loader",
            "fast-css-loader",
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            "cache-loader",
            "style-loader",
            "fast-css-loader",
            {
              loader: "less-loader",
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    output: { clean: true },
    plugins: [new webpack.ProgressPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  });
};
