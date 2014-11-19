/* @flow */

var Coquette = require('coquette');
var World = require('./World');
var Kart = require('./Kart');

type AssetMap = {
  images: {
    [key: string]: Image
  };
  audio: {
    [key:string]: ArrayBuffer
  };
}

class Game {
  c: Coquette;
  assets: AssetMap;
  width: number;
  height: number;

  constructor(assets: AssetMap) {
    this.assets = assets;

    this.width = 240;
    this.height = 160;

    this.c = window.__coquette__ = new Coquette(this, 'canvas', this.width, this.height, 'black');

    this.c.renderer.getCtx().imageSmoothingEnabled = false;

    var mode7Config = {
      horizon: 0,

      spaceZ: 12,
      scaleX: 200,
      scaleY: 200,

      objScaleX: 6,
      objScaleY: 16,

      fallbackColor: [104, 80, 8, 255],
    };

    window.config = mode7Config;

    var kart = this.c.entities.create(Kart, {
      mode7Config: mode7Config,
      horizonOffset: 75,

      position: {
        x: 897,
        y: 667,
        angle: 270
      },
    });

    this.world = this.c.entities.create(World, {
      cameraOffset: -30,
      mode7Config: mode7Config,
      horizonOffset: 75
    });

  }
}

module.exports = Game;
