var paths = require('./paths.js');

module.exports = {
  devtool: 'cheap-module-source-map',
  devServer: { inline: true },
  entry: {
    app: [paths.source + 'main.js']
  },
  output: {
    path: paths.build,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
      {
        include: /\.json$/,
        loader: 'file',
        query: {
          name: '[name].[hash:8].[ext]'
        }
      }
    ]
  },
  eslint: {
    configFile: './eslintrc.js',
    failOnError: true
  }
};
