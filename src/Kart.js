/* @flow */

var drawObject = require('./util/mode7/drawObject');
var calcVector = require('./util/calcVector');
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

type Position = {
  x: number;
  y: number;
  angle: number;
};

type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type KartOpts = {
  textureImageData: ImageData;  // TODO: No ImageData declaration either D:
  horizonOffset: number;
  mode7Config: Mode7Config;
  position: Position;
};


var MAX_SPEED = 8;
var MAX_BACKWARDS_SPEED = -3;
var ACCEL = 6;
var FRICTION_ACCEL = -2;
var TURN_SPEED = 9;

class Kart {
  game: Game;
  image: Image;
  horizonOffset: number;
  mode7Config: Mode7Config;
  position: Position;
  speed: number;
  imageParams: Rectangle;

  constructor(game: Game, opts: KartOpts) {
    this.game = game;

    this.image = this.game.assets.images['mario'];
    this.imageParams = {
      x: 2,
      y: 33,
      w: 28,
      h: 30
    };
    this.horizonOffset = opts.horizonOffset || 0;
    this.mode7Config = opts.mode7Config;

    this.position = opts.position;
    this.speed = 0;
  }

  draw(ctx: any) {
    var cameraPos = this.game.world.position;
    var angle = cameraPos.angle * Math.PI/180;

    var targetSize = {
      w: this.game.width,
      h: this.game.height - this.horizonOffset,
      x: 0,
      y: this.horizonOffset
    };
    drawObject(ctx, targetSize, this.image, this.imageParams, cameraPos.x, cameraPos.y, angle,
               this.position.x, this.position.y, this.mode7Config);
  }

  _accel(dt: number, isForward: boolean) {
    var mult = isForward ? 1 : -1;
    var spd = this.speed + mult * ACCEL * dt/1000;

    if (spd > MAX_SPEED) {
      spd = MAX_SPEED;
    } else if (spd < MAX_BACKWARDS_SPEED) {
      spd = MAX_BACKWARDS_SPEED;
    }

    this.speed = spd;
  }

  _applyFriction(dt: number) {
    if (this.speed > 0) {
      this.speed = this.speed + FRICTION_ACCEL * dt/1000;
    } else if (this.speed < 0) {
      this.speed = this.speed - FRICTION_ACCEL * dt/1000;
    }
  }

  _turn(dt: number, isRight: boolean) {
    var mult = isRight ? 1 : -1;

    // scale increases linearly until 3/4 of max is reached
    var scaleFactor = this.speed * 2 / MAX_SPEED;
    if (scaleFactor > 1.5) { scaleFactor = 1; }

    var turnStep = mult * (TURN_SPEED * dt/100) * scaleFactor;

    this.position.angle += turnStep;
  }

  _updatePosition(dt: number) {
    // Calculate new angle based on speed
    var vec = calcVector(this.speed, this.position.angle);

    this.position.x += vec.x * dt/50;
    this.position.y += vec.y * dt/50;
  }

  update(dt: number) {
    var c = this.game.c;

    if (c.inputter.isDown(c.inputter.W)) {
      this._accel(dt, true);
    }  else if (c.inputter.isDown(c.inputter.S)) {
      this._accel(dt, false);
    }

    this._applyFriction(dt);

    if (c.inputter.isDown(c.inputter.A)) {
      this._turn(dt, false);
    } else if (c.inputter.isDown(c.inputter.D)) {
      this._turn(dt, true);
    }

    this._updatePosition(dt);

    this.game.world.moveCamera(this.position);
  }
}

module.exports = Kart;
