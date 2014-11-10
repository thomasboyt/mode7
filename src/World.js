var mode7 = require('./util/mode7/ground');

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

    this.textureImageData = imageDataFromImg(this.game.assets.images.map);
    this.horizOffset = opts.horizOffset;
    this.config = opts.mode7Config;
  }

  moveCamera(kartPos) {
    // move camera behind kart

    var angle = kartPos.angle * Math.PI/180;
    var dx = Math.cos(angle) * -26;
    var dy = Math.sin(angle) * -26;

    this.position = {
      x: kartPos.x + dx,
      y: kartPos.y + dy,
      angle: kartPos.angle
    };
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

}

module.exports = World;
