const path = require("path");
const { mergeWithRules } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "learnss",
    projectName: "utils",
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
      externals: ["vue", "pinia", "lodash", "ant-design-vue", "dayjs"],
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
