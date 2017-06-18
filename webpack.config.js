/* eslint-disable object-shorthand,func-names */

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
    './sources',
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    path: path.join(__dirname, 'public/built/'),
    publicPath: '/built/',
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          forceEnv: 'production',
        },
      }],
    }, {
      test: /\.(scss|css)$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
        options: {
          minimize: true,
        },
      }, {
        loader: 'sass-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: function () {
            return [autoprefixer('last 2 versions', 'ie 9')];
          },
        },
      }],
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ],
};
