var q = require('q');
var _ = require('lodash');

var AssetPreloader = function(assetCfg) {
  /* jshint loopfunc: true */

  this.assets = {
    'images': {},
    'audio': {}
  };

  this._images = assetCfg.images;
  this._audio = assetCfg.audio;

  this.numTotal = _.keys(this._images).length + _.keys(this._audio).length;
  this.numLoaded = 0;
};

AssetPreloader.prototype.load = function() {
  this.dfd = q.defer();

  _.each(this._images, function(src, name) {
    var img = new Image();
    img.onload = this.onAssetLoaded.bind(this);
    img.src = src;

    this.assets.images[name] = img;
  }.bind(this));

  _.each(this._audio, function(src, name) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function() {
      this.assets.audio[name] = xhr.response;
      this.onAssetLoaded();
    }.bind(this);

    xhr.send();
  }.bind(this));

  return this.dfd.promise;
};

AssetPreloader.prototype.onAssetLoaded = function() {
  this.numLoaded += 1;

  if ( this.numTotal === this.numLoaded ) {
    this.dfd.resolve(this.assets);
  }
};

module.exports = AssetPreloader;
