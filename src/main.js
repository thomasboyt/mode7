var Coquette = require('coquette');
var mapUrl = require('../assets/map.png');
var World = require('./World');

class Game {
  constructor(image) {
    this.width = 500;
    this.height = 250;

    this.c = window.__coquette__ = new Coquette(this, 'canvas', this.width, this.height, 'black');

    var world = this.c.entities.create(World, {
      texture: image,

      position: {
        x: 877,
        y: 605,
        angle: 45
      },
      mode7Config: {
        spaceZ: 15,
        scaleX: 300,
        scaleY: 300,
        horizon: 50  // todo: wtf?
      },
      horizOffset: 50
    });
  }
}

// TODO: replace this with something like AssetPreloader
function init() {
  var img = new Image();

  img.onload = function() {
    new Game(img);
  };

  img.src = mapUrl;
}

init();
