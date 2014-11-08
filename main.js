(function() {

function getImgDataOffset(imgData, x, y) {
  return (x + imgData.width * y) * 4;
}

function getPixelData(imgData, x, y) {
  var data = imgData.data;
  var out = [];

  var offset = getImgDataOffset(imgData, x, y);
  out[0] = data[offset];
  out[1] = data[offset+1];
  out[2] = data[offset+2];
  out[3] = data[offset+3];

  return out;
}

function putPixelData(imgData, pixelData, x, y) {
  var offset = getImgDataOffset(imgData, x, y);

  imgData.data[offset] = pixelData[0];
  imgData.data[offset+1] = pixelData[1];
  imgData.data[offset+2] = pixelData[2];
  imgData.data[offset+3] = pixelData[3];
}

function mode7(ctx, imgData, width, height) {
  // http://helixsoft.nl/articles/circle/sincos.htm
  var start = Date.now();

  var transformedImgData = ctx.createImageData(width, height);

  // Camera height
  var spaceZ = 20;

  // Scale of space coordinates to screen coordinates
  var scaleX = 2000;
  var scaleY = 2000;

  // Horizon location on screen
  var horizon = 250;

  // Angle of viewing?
  var cx = 500;
  var cy = 500;
  // var angle = 90 * 180/Math.PI;
  var angle = 90;

  // iterate over scanlines...
  for (var screenY = 0; screenY < height; screenY++) {
    // distance of the line to draw
    var distance = (spaceZ * scaleY) / (screenY + horizon);

    // calculate the distance between space points on the line
    var horizontalScale = distance / scaleX;

    // ?
    var dx = -Math.sin(angle) * horizontalScale;
    var dy = Math.cos(angle) * horizontalScale;

    // Starting position
    var spaceX = cx + (distance * Math.cos(angle)) - width/2 * dx;
    var spaceY = cy + (distance * Math.sin(angle)) - width/2 * dy;

    for (var screenX = 0; screenX < width; screenX++) {
      var pixelData = getPixelData(imgData, Math.round(spaceX), Math.round(spaceY));
      putPixelData(transformedImgData, pixelData, screenX, screenY);

      spaceX += dx;
      spaceY += dy;
    }

  }

  return transformedImgData;
}

function imageDataFromImage(img) {
  // draw original to an in-memory canvas
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

function render(canvas, img) {
  var imgData = imageDataFromImage(img);

  var ctx = canvas.getContext('2d');
  imgData = mode7(ctx, imgData, 500, 500);

  ctx.putImageData(imgData, 0, 0, 0, 0, 500, 500);
}

function init() {
  var canvas = document.getElementById('canvas');
  canvas.width = 500;
  canvas.height = 500;

  var img = new Image();
  img.onload = function() {
    render(canvas, img);
  };
  img.src = '/crop_map.png';
}

init();

})();

