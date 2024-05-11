const path = require("path");
const _ = require("lodash");
const webpack = require("webpack");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const { mergeWithCustomize } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/dist/plugin").default;

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "learnss",
    projectName: "styleguide",
    webpackConfigEnv,
    argv,
  });

  return mergeWithCustomize({
    customizeArray(a, b, key) {
      if (key == "module.rules") {
        /**
         * Remove the default rule because it uses babel to handle typescript files
         * */
        const jsTsTest = "/\\.(js|ts)x?$/";
        a = a.filter((rule) => rule.test.toString() != jsTsTest);

        /**
         * Remove the exclude property from the default rules because we need
         * to parse files in node_modules folder
         */
        const imageTest = "/\\.(bmp|png|svg|jpg|jpeg|gif|webp)$/i";

        a = a.map((rule) => {
          if (rule.test.toString() == imageTest) {
            return {
              ...rule,
              exclude: undefined,
            };
          }

          return rule;
        });
      }

      return _.uniq([...a, ...b]);
    },
  })(defaultConfig, {
    externals: [
      "vue",
      "pinia",
      "lodash",
      "@learnss/utils",
      "ant-design-vue",
      "dayjs",
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: { rootMode: "upward" },
            },
            {
              loader: "ts-loader",
              options: { appendTsSuffixTo: [/\.vue$/] },
            },
          ],
        },
        {
          test: /\.vue$/,
          use: [
            "cache-loader",
            {
              loader: "vue-loader",
              options: {
                hotReload: false,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            "cache-loader",
            "style-loader",
            "css-loader",
            "sass-loader",
            {
              loader: "style-resources-loader",
              options: {
                patterns: [
                  path.resolve(__dirname, "./src/styles/antd/_variables.scss"),
                  path.resolve(__dirname, "./src/styles/antd/_mixins.scss"),
                ],
              },
            },
          ],
        },
      ],
    },
    output: { clean: true },
    plugins: [new VueLoaderPlugin(), new webpack.ProgressPlugin()].filter(
      Boolean
    ),
    resolve: {
      extensions: [".vue"],
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    //performance optimization settings
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
  });
};
