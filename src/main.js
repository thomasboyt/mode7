var Game = require('./Game');
var mapUrl = require('../assets/map.png');

// TODO: replace this with something like AssetPreloader
function init() {
  var img = new Image();

  img.onload = function() {
    new Game(img);
  };

  img.src = mapUrl;
}

init();
