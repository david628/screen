const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Is the current build a development build
const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, './src');
const dirAssets = path.join(__dirname, './src/assets');

const appHtmlTitle = '美欣达集团管理驾驶舱平台';
/**
 * Webpack Configuration
 */
module.exports = {
  entry: {
    vendor: ['lodash'],
    bundle: path.join(dirApp, 'main')
  },
  resolve: {
    modules: [
      dirNode,
      dirApp,
      dirAssets
    ]
  },
  devServer: {
    compress: true,
    proxy: {
      "/": {
        "target": "http://183.129.170.220:8088",
        "secure": false
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: IS_DEV
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.ejs'),
      title: appHtmlTitle
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /(node_modules)/,
      options: {
        compact: true
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: IS_DEV
          }
        }
      ]
    }, {
      test: /\.(scss|less)$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: IS_DEV
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: IS_DEV,
            includePaths: [dirAssets]
          }
        }/*, {  
          loader: 'less-loader',
          options: {
            sourceMap: IS_DEV,
            includePaths: [dirAssets],
            javascriptEnabled: true
          }
        }*/
      ]
    }, {
      test: /\.(jpe?g|png|gif)$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    }]
  }
};