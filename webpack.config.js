var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/main.js',
    vendor: ['coquette']
  },

  output: {
    path: 'public/',
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
      {test: /\.js$/, loader: 'esnext'},

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
