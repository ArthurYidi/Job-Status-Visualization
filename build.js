#!/usr/bin/env node

var paths = require('./paths.js');
var webpack = require('webpack');
var config = require('./webpack.config.js');
var fs = require('fs-extra');

function build() {
  // fs.emptyDirSync(paths.build);

  var compiler = webpack(config);
  compiler.run(function(err, stats) {
    if (err) {
      console.log(err);
    }

    var output = stats.toString({
      chunks: false,
      colors: true
    });

    console.log(output);
  });

  // fs.copySync(paths.public, paths.build);
}

build();