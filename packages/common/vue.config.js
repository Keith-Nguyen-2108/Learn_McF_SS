const { defineConfig } = require("@vue/cli-service");
const path = require("path");
const fs = require("fs");

const EventHooksPlugin = require("event-hooks-webpack-plugin");

module.exports = defineConfig({
  configureWebpack: {
    output: {
      path: path.resolve("./dist"),
      filename: "app.js",
      libraryTarget: "system",
    },
    plugins: [
      new EventHooksPlugin({
        done: () => {
          if (process.env.NODE_ENV !== "development") {
            const buildDir = path.join(__dirname, "/dist");
            fs.unlinkSync(`${buildDir}/index.html`);
          }
        },
      }),
    ],
    // this option is to fix the bug performance size limit.
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  },
  chainWebpack(config) {
    config.plugin("SystemJSPublicPathWebpackPlugin").tap((args) => {
      args[0].rootDirectoryLevel = 0;
      return args;
    });
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        return {
          ...options,
          hotReload: false,
        };
      });

    config.module
      .rule("js")
      .use("babel-loader")
      .loader("babel-loader")
      .tap((options) => ({
        ...options,
        rootMode: "upward",
      }));

    config.module
      .rule("ts")
      .use("babel-loader")
      .loader("babel-loader")
      .tap((options) => ({
        ...options,
        rootMode: "upward",
      }));

    config.module.rule("images").type("asset/resource");
    config.externals([
      "ant-design-vue",
      "pinia",
      "vue",
      "vue-router",
      "single-spa",
      "dayjs",
      "@learnss/utils",
      "@learnss/styleguide",
    ]);
  },
  filenameHashing: false,
  lintOnSave: false,
  transpileDependencies: true,
});
