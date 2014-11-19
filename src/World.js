/* @flow */

var drawGround = require('./util/mode7/drawGround');
var imageDataFromImg = require('./util/imageDataFromImage');
var Game = require('./Game');

type Mode7Config = {
  horizon: number;
  spaceZ: number;
  scaleX: number;
  scaleY: number;
  objScaleX: number;
  objScaleY: number;
  fallbackColor: [number, number, number, number]
};

type WorldOpts = {
  textureImageData: ImageData;  // TODO: No ImageData declaration either D:
  horizonOffset: number;
  cameraOffset: number;
  mode7Config: Mode7Config;
};

type Position = {
  x: number;
  y: number;
  angle: number;
}

class World {
  textureImageData: ImageData;
  horizonOffset: number;
  cameraOffset: number;
  config: Mode7Config;
  position: Position;
  game: Game;

  constructor(game : Game, opts : WorldOpts) {
    this.game = game;

    this.textureImageData = imageDataFromImg(this.game.assets.images['map']);
    this.horizonOffset = opts.horizonOffset || 0;
    this.cameraOffset = opts.cameraOffset || 0;
    this.config = opts.mode7Config;
  }

  moveCamera(kartPos : Position) {
    // move camera behind kart

    var angle = kartPos.angle * Math.PI/180;
    var dx = Math.cos(angle) * this.cameraOffset;
    var dy = Math.sin(angle) * this.cameraOffset;

    this.position = {
      x: kartPos.x + dx,
      y: kartPos.y + dy,
      angle: kartPos.angle
    };
  }

  // TODO: ctx : Canvas2DRenderingContext
  draw(ctx : any) {
    // Skybox
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, this.game.width, this.horizonOffset);

    // Ground
    var height = this.game.height - this.horizonOffset;
    var target = ctx.createImageData(this.game.width, height);

    var rad = this.position.angle * (Math.PI/180);
    drawGround(target, this.textureImageData, this.position.x, this.position.y, rad, this.config);

    ctx.putImageData(target, 0, this.horizonOffset, 0, 0,
                     this.game.width, height);
  }

}

module.exports = World;
