#!/usr/bin/env node

var paths = require('./paths.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var fs = require('fs-extra');

config.entry.app.unshift('webpack-dev-server/client?http://localhost:8080/');

function run() {
  fs.emptyDirSync(paths.build);

  var compiler = webpack(config);
  var devServer = new WebpackDevServer(compiler, {
    compress: true,
    contentBase: paths.public
  });

  devServer.listen(8080, (err, result) => {
    if (err) {
      return console.log(err);
    }
  });
}

run();