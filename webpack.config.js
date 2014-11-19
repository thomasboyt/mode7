var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: ['coquette', 'q', 'lodash']
  },

  output: {
    path: 'build/',
    filename: "bundle.js"
  },

  resolve: {
    // allow resolve modules that are in node_modules/ before looking into subdirectory
    // prevent duplicate copies of modules
    root: require('path').resolve('./node_modules')
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'jsx-loader',
        query: {
          stripTypes: true,
          harmony: true
        }
      },

      {
        test: /\.png$/,
        loader: 'file-loader',
        query: {
          name: '/assets/[hash].[ext]'
        }
      }
    ]
  }
};
