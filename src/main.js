/* @flow */

var Game = require('./Game');
var AssetPreloader = require('./util/AssetPreloader');

var mapUrl : string = require('../assets/map.png');
var marioUrl : string = require('../assets/kart-sheet-mario.png');

function init() {
  var preloader = new AssetPreloader({
    images: {
      map: mapUrl,
      mario: marioUrl,
    },
    audio: null  // TODO: this is a workaround for https://github.com/facebook/flow/issues/38
  });

  preloader.load().done(function(assets) {
    new Game(assets);
  });
}

window.onload = init;
