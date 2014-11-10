var Game = require('./Game');
var AssetPreloader = require('./util/AssetPreloader');

var mapUrl = require('../assets/map.png');
var marioUrl = require('../assets/kart-sheet-mario.png');
var marioBackUrl = require('../assets/mario-back.png');

function init() {
  var preloader = new AssetPreloader({
    images: {
      map: mapUrl,
      mario: marioUrl,
      marioBack: marioBackUrl
    }
  });

  preloader.load().done(function(assets) {
    new Game(assets);
  });
}

window.onload = init;
