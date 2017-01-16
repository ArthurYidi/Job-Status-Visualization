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
        exclude: /node_modules\/(?!@?material)/,
        query: {
          presets: ['es2015'],
          cacheDirectory: true
        }
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        include: [/\.json$/, /\.(eot|woff2|woff|ttf|svg)$/],
        loader: 'url-loader?limit=1000'
      }
    ]
  },
  
  eslint: {
    configFile: './eslintrc.js',
    failOnError: true
  },
  sassLoader: {
    includePaths: ['./node_modules/material-design-lite/src']
  },
  fileLoader: {
    name: '[name].[ext]'
  }

};
