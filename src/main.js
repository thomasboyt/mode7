var mode7 = require('./renderer');
var mapUrl = require('../assets/crop_map.png');

function imageDataFromImage(img) {
  // draw original to an in-memory canvas
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

var Mode7Manager = function(canvas, img) {
  this.canvas = canvas;
  this.originMap = imageDataFromImage(img);

  this.position = {
    x: 500,
    y: 500,
    angle: 0
  };

  this.config = {
    spaceZ: 20,
    scaleX: 3000,
    scaleY: 3000,
    horizon: 250
  };
};

Mode7Manager.prototype.render = function(cx, cy, angle) {
  var ctx = this.canvas.getContext('2d');
  var target = ctx.createImageData(canvas.width, canvas.height);

  var rad = this.position.angle * (Math.PI/180);
  mode7(target, this.originMap, this.position.x, this.position.y, rad, this.config);

  ctx.putImageData(target, 0, 0, 0, 0, 500, 500);
};

// Move forward or backward by step based on current angle
Mode7Manager.prototype._move = function(step) {

  var angle = this.position.angle * Math.PI/180;
  var dx = Math.cos(angle) * step;
  var dy = Math.sin(angle) * step;

  this.position.x = this.position.x + dx;
  this.position.y = this.position.y + dy;
};

Mode7Manager.prototype.handleKeyDown = function(e) {
  var keyCode = e.keyCode;

  var up = 87;      // W
  var down = 83;    // S
  var left = 65;    // A
  var right = 68;   // D

  var step = 3;
  var turnStep = 1;

  if (keyCode === up) {
    this._move(step);
  } else if (keyCode === down) {
    this._move(-step);
  } else if (keyCode === left) {
    this.position.angle -= turnStep;
  } else if (keyCode === right) {
    this.position.angle += turnStep;
  } else {
    return;
  }

  this.render();
};

function init() {
  var canvas = document.getElementById('canvas');
  canvas.width = 500;
  canvas.height = 500;

  var img = new Image();

  img.onload = function() {

    var mode7 = new Mode7Manager(canvas, img);
    mode7.render(500, 500, 0);
    window.onkeydown = (e) => { mode7.handleKeyDown(e); };

    global.mode7 = mode7;

  };

  img.src = mapUrl;
}

init();
