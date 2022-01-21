const rules = require('./webpack.rules');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: require.resolve("babel-loader"),
});

rules.push({
  test: /\.png|svg|jpg|gif$/,
  use: ["file-loader"],
});

module.exports = {
  // Put your normal webpack config below here
  resolve: {
    modules: [__dirname, "src", "node_modules"],
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
    alias: {
      assets: path.resolve(__dirname, 'src/main_window/assets/'),
      contexts: path.resolve(__dirname, 'src/contexts/'),
      utils: path.resolve(__dirname, 'src/utils/'),
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      'React': 'react'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/main_window', 'assets'),
          to: path.resolve(__dirname, `.webpack/renderer/main_window/`, 'assets')
        }
      ]
    })
  ],
  module: {
    rules,
  }
};
