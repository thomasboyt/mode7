var Coquette = require('coquette');
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
        horizon: 0,
        fallbackColor: [104, 80, 8, 255]
      },
      horizOffset: 50
    });

    window.world = world;
  }
}

module.exports = Game;
