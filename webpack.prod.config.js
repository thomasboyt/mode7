var _ = require('lodash');

var config = require('./webpack.config');

config = _.merge({
  output: {
    publicPath: '/mode7/'
  }
}, config);

module.exports = config;
