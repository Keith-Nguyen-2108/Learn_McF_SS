const path = require("path");
const { mergeWithRules } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "learnss",
    projectName: "react-utils",
    webpackConfigEnv,
    argv,
  });

  const smp = new SpeedMeasurePlugin({
    outputFormat: "humanVerbose",
    loaderTopFiles: 10,
  });

  return smp.wrap(
    mergeWithRules({
      module: {
        rules: {
          test: "match",
          use: "replace",
        },
      },
    })(defaultConfig, {
      externals: ["react", "react-dom", "@learnss/utils"],
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
        ],
      },
      output: { clean: true },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        }),
      ],
      //performance optimization settings
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
    })
  );
};
