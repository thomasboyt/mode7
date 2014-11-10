var drawObject = require('./util/mode7/drawObject');

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
    this.position = opts.position;
    this.mode7Config = opts.mode7Config;
  }

  draw(ctx) {
    var cameraPos = this.game.world.position;
    var angle = cameraPos.angle * Math.PI/180;
    drawObject(ctx, this.image, this.imageParams, cameraPos.x, cameraPos.y, angle,
               this.position.x, this.position.y, this.mode7Config);
  }

  _move(step) {
    var angle = this.position.angle * Math.PI/180;
    var dx = Math.cos(angle) * step;
    var dy = Math.sin(angle) * step;

    this.position.x = this.position.x + dx;
    this.position.y = this.position.y + dy;
  }

  update(dt) {
    var c = this.game.c;

    var step = 10 * dt/100;
    var turnStep = 10 * dt/100;

    if (c.inputter.isDown(c.inputter.W)) {
      this._move(step);
    } else if (c.inputter.isDown(c.inputter.S)) {
      this._move(-step);
    }

    if (c.inputter.isDown(c.inputter.A)) {
      this.position.angle -= turnStep;
    } else if (c.inputter.isDown(c.inputter.D)) {
      this.position.angle += turnStep;
    }

    this.game.world.moveCamera(this.position);
  }
}

module.exports = Kart;
