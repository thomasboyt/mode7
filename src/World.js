var mode7 = require('./renderer');

function imageDataFromImg(img) {
  // draw original to an in-memory canvas
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

class World {
  constructor(game, opts) {
    this.game = game;

    this.textureImageData = imageDataFromImg(opts.texture);
    this.position = opts.position;
    this.horizOffset = opts.horizOffset;
    this.config = opts.mode7Config;
  }

  draw(ctx) {
    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, this.game.width, this.horizOffset);

    var target = ctx.createImageData(this.game.width, this.game.height);

    var rad = this.position.angle * (Math.PI/180);
    mode7(target, this.textureImageData, this.position.x, this.position.y, rad, this.config);

    ctx.putImageData(target, 0, this.horizOffset, 0, 0,
                     this.game.width, this.game.height - this.horizOffset);
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
  }
}

module.exports = World;
