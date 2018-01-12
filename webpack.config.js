'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlPlugin = require('webpack-html-plugin');
var merge = require('webpack-merge');
var HasteResolverPlugin = require('haste-resolver-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV;
var ROOT_PATH = path.resolve(__dirname);
var DEMO_DIR = 'Examples';
var config = {
  paths: {
    src: path.join(ROOT_PATH, 'Libraries'),
  }
};

var mergeCommon = merge.bind(null, {
  resolve: {
    alias: {
      'react-native': 'ReactWeb',
      'ReactART': 'react-art'
    },
    extensions: ['', '.js', '.jsx', '.md', '.css', '.png', '.jpg'],
  },
  module: {
    loaders: [{
      test: /\.png$/,
      loader: 'url?limit=100000&mimetype=image/png',
    }, {
      test: /\.jpg$/,
      loader: 'file',
    }, {
      test: /\.json$/,
      loader: 'json',
    }, ]
  },
  plugins: [
    new HasteResolverPlugin({
      platform: 'web',
      blacklist: ['lib']
    }),
  ]
});

if (NODE_ENV === 'development') {
  var IP = '0.0.0.0';
  var PORT = 3000;
  module.exports = mergeCommon({
    ip: IP,
    port: PORT,
    devtool: 'source-map',
    entry: [
      'babel-polyfill',
      'webpack-dev-server/client?http://' + IP + ':' + PORT,
    ],
    output: {
      publicPath:'',
      path: __dirname,
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
        }
      }),
      // new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlPlugin(),
    ],
    module: {
      preLoaders: [{
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: [config.paths.src],
      }],
      loaders: [{
        test: /\.jsx?$/,
        loader: 'react-hot',
        include: [config.paths.src],
      },
      {
        test: /\.jsx?$/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react-native', 'stage-1']
        },
        include: [config.paths.src],
      }]
    }
  });
}

if (NODE_ENV === 'production') {

  module.exports = mergeCommon({
    devtool: 'source-map',
    entry: {
      // tweak this to include your externs unless you load them some other way
      'react-web': ['react-native'],
    },
    output: {
      publicPath:'',
      path: './pages',
      filename: '[name].js',
      sourceMapFilename: '[file].map',
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        }
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
      }),
      new webpack.optimize.CommonsChunkPlugin('react-web', 'react-web.js'),
    ],
    module: {
      loaders: [{
        test: /\.jsx?$/,
        loader: 'babel', // 'babel-loader' is also a legal name to reference
        query: {
          presets: ['react-native', 'stage-1']
        },
        include: [config.paths.src],
      }]
    }
  });
}
