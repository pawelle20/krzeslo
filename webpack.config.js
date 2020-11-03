/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var path = require('path');
var webpack = require('webpack');
var WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const production = process.argv.indexOf('-p') !== -1;


var config = {
  entry: [
    './resources/js/index.js',
    './resources/scss/main.scss'
  ],
  output: {
    filename: 'js/[name].bundle.js',
    path: path.resolve(__dirname, './bundles'),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        exclude: /(node_modules)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['file-loader?name=css/[name].css', 'extract-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader']
        })
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/tmp.css'
      // allChunks: true
    }),
//        new webpack.DefinePlugin({
//            'process.env': {
//                NODE_ENV: JSON.stringify('production')
//            }
//        })
//        new webpack.optimize.CommonsChunkPlugin({
//            name: 'commons',
//            filename: 'js/commons.js',
//            minChunks: 2
//        })
  ],
  resolve: {
    //alias: {'picker': 'pickadate/lib/picker'}
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};

if (production) {
  config.entry.babelpolyfill = 'babel-polyfill';
  config.module.rules.push({
    test: /\.js$/,
    use: [{
      loader: 'babel-loader',
      options: {
        presets: [['es2015', 'stage-2']],
        plugins: ['syntax-dynamic-import']
      }
    }]
  });
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      // Drop console statements
      drop_console: true
    },
    output: {
      comments: false,
      "ascii_only": true
    }
  }));


} else {
  config.plugins.push(new WebpackBuildNotifierPlugin());
  config.devtool = 'source-map'; //'inline-eval-cheap-source-map';
}


module.exports = config;


