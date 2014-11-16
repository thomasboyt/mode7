var drawGround = require('./util/mode7/drawGround');

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
    this.horizonOffset = opts.horizonOffset || 0;
    this.cameraOffset = opts.cameraOffset || 0;
    this.config = opts.mode7Config;
  }

  moveCamera(kartPos) {
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

  draw(ctx) {
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
