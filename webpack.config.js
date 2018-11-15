const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: ['./client/js/index.js'],
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modules: ['client/js', 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'client/js/')],
        exclude: /node_modules/,
        options: { cacheDirectory: true }
      },
      {
        test: /\.s?css$/,
        loaders: ['style-loader', 'css-loader?sourceMap?root=.', 'sass-loader']
      },
      {
        test: /\.(svg|png|jpe?g)$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      WEATHER_API_KEY: '2b07eb79e75f25c3f2d9b46b33061a82'
    })
  ],
  watch: true
};
