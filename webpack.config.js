const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new TerserPlugin(),
    new CssMinimizerPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.pug",
      filename: "index.html"
    }),
    new ESLintPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      { test: /\.css$/,
       use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: true,
        },
      }, "css-loader"] },
      { test: /\.pug$/,
        use: [{
          loader: "pug-loader",
          options: {
            pretty: true,
          },
        }]
      }
    ]
  }
};