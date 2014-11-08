module.exports = {
  entry: {
    app: './src/main.js'
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
