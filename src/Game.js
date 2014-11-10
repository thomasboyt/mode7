var Coquette = require('coquette');
var World = require('./World');
var Kart = require('./Kart');

class Game {
  constructor(assets) {
    this.assets = assets;

    this.width = 500;
    this.height = 250;

    this.c = window.__coquette__ = new Coquette(this, 'canvas', this.width, this.height, 'black');

    var mode7Config = {
      horizon: 0,

      spaceZ: 25,
      scaleX: 350,
      scaleY: 250,

      objScaleX: 4,
      objScaleY: 8,

      fallbackColor: [104, 80, 8, 255],
    };

    var kart = this.c.entities.create(Kart, {
      mode7Config: mode7Config,
      position: {
        x: 897,
        y: 667,
        angle: 270
      },
    });

    this.world = this.c.entities.create(World, {
      mode7Config: mode7Config,
      horizOffset: 50
    });

  }
}

module.exports = Game;
