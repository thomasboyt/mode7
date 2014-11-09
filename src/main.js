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
        x: 897,
        y: 667,
        angle: 270
      },
      mode7Config: {
        spaceZ: 25,
        scaleX: 350,
        scaleY: 250,
        horizon: 0
      },
      horizOffset: 50
    });

    window.world = world;
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
