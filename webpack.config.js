var path = require('path');
var paths = require('./paths.js');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  
  devtool: 'source-map',
  devServer: { inline: true },
  
  entry: {
    app: [path.join(paths.source, 'main.js')]
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
        // exclude all node_modules except material design packages
        exclude: /node_modules\/(?!(@?material|mdl-|md-))/,
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          babelrc: false
        }
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css?sourceMap!sass-loader?sourceMap')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        include: [/\.json$/, /\.(eot|woff2|woff|ttf|svg)$/],
        loader: 'url-loader?limit=1000'
      }
    ]
  },
  
  eslint: {
    configFile: './eslintrc.js',
    fix: true,
    failOnError: true
  },
  sassLoader: {
    includePaths: ['./node_modules/material-design-lite/src']
  },
  fileLoader: {
    name: '[name].[hash:8].[ext]'
  },
  
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: path.join(paths.source, 'templates/index.ejs')
    }),
    
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      exclude: [/\.min\.js$/gi]
    }),
    // ignore moment js locale
    new webpack.IgnorePlugin(/^\.\/locale$/, [/moment$/]),
    
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.json$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};