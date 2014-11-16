var drawObject = require('./util/mode7/drawObject');
var calcVector = require('./util/calcVector');

class Kart {
  constructor(game, opts) {
    this.game = game;

    this.image = this.game.assets.images.mario;
    this.imageParams = {
      x: 2,
      y: 33,
      w: 28,
      h: 30
    };
    this.horizonOffset = opts.horizonOffset || 0;
    this.mode7Config = opts.mode7Config;

    this.MAX_SPEED = 8;
    this.MAX_BACKWARDS_SPEED = -3;
    this.ACCEL = 6;
    this.FRICTION_ACCEL = -2;
    this.TURN_SPEED = 9;

    this.position = opts.position;
    this.speed = 0;
  }

  draw(ctx) {
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

  _accel(dt, isForward) {
    var mult = isForward ? 1 : -1;
    var spd = this.speed + mult * this.ACCEL * dt/1000;

    if (spd > this.MAX_SPEED) {
      spd = this.MAX_SPEED;
    } else if (spd < this.MAX_BACKWARDS_SPEED) {
      spd = this.MAX_BACKWARDS_SPEED;
    }

    this.speed = spd;
  }

  _applyFriction(dt) {
    if (this.speed > 0) {
      this.speed = this.speed + this.FRICTION_ACCEL * dt/1000;
    } else if (this.speed < 0) {
      this.speed = this.speed - this.FRICTION_ACCEL * dt/1000;
    }
  }

  _turn(dt, isRight) {
    var mult = isRight ? 1 : -1;

    // scale increases linearly until 3/4 of max is reached
    var scaleFactor = this.speed * 2 / this.MAX_SPEED;
    if (scaleFactor > 1.5) { scaleFactor = 1; }

    var turnStep = mult * (this.TURN_SPEED * dt/100) * scaleFactor;

    this.position.angle += turnStep;
  }

  _updatePosition(dt) {
    // Calculate new angle based on speed
    var vec = calcVector(this.speed, this.position.angle);

    this.position.x += vec.x * dt/50;
    this.position.y += vec.y * dt/50;
  }

  update(dt) {
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
