const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  entry: './client/src/index.jsx',
  output: {
    path: path.resolve(__dirname, 'client/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      include: path.resolve(__dirname, 'client/src'),
      loader: 'babel-loader',
      options: {
        presets: ['env', 'react'],
        plugins: ['transform-class-properties'],
      },
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader?url=false',
      ],
    },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
