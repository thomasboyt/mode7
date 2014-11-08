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

/**
 * Based off of:
 * http://helixsoft.nl/articles/circle/sincos.htm
 *
 * Params:
 *   - target [ImageData]   An ImageData object to use for output
 *   - input [ImageData]    The ImageData to draw pixels from
 *   - cx, cx [int]         The origin on the original plane
 *   - angle [int]          The angle (in radians) on the original plane
 *   - config [object]:
 *       - spaceZ [int]           Height of the camera above the plane
 *       - scaleX, scaleY [int]   Scale of space coordinates to screen coordinates
 *       - horizon [int]          Horizon location on the screen
 */
function mode7(target, input, cx, cy, angle, config) {

  var spaceZ = config.spaceZ;
  var scaleX = config.scaleX;
  var scaleY = config.scaleY;
  var horizon = config.horizon;

  var width = target.width;
  var height = target.height;

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
      var pixelData = getPixelData(input, Math.round(spaceX), Math.round(spaceY));
      putPixelData(target, pixelData, screenX, screenY);

      spaceX += dx;
      spaceY += dy;
    }
  }
}

module.exports = mode7;
