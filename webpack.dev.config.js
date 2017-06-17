const path = require('path');

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
      loader: 'babel-loader',
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }],
  },
  devServer: {
    contentBase: 'public',
    inline: true,
    port: 8000,
    host: 'localhost',
  },
};
