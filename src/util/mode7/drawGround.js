function getImgDataOffset(imgData, x, y) {
  return (x + imgData.width * y) * 4;
}

function getPixelData(imgData, x, y) {
  var data = imgData.data;
  var offset = getImgDataOffset(imgData, x, y);

  if (data[offset] === undefined) {
    throw new Error('attempting to render undefined pixel');
  }

  return [
    data[offset],
    data[offset+1],
    data[offset+2],
    data[offset+3]
  ];
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
 *   - target [ImageData]       An ImageData object to use for output
 *   - input [ImageData]        The ImageData to draw pixels from
 *   - cx, cx [int]             The camera position
 *   - angle [int]              The camera angle (in radians)
 *   - config [object]:
 *       - spaceZ [int]           Height of the camera above the plane
 *       - scaleX, scaleY [int]   Scale of space coordinates to screen coordinates
 *       - horizon [int]          Horizon location on the screen
 *       - fallbackColor [array]  Array of [int, int, int, int] representing [r, g, b, alpha] to
 *                                render for area outside of bounds
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
      var rSpaceX = Math.round(spaceX);
      var rSpaceY = Math.round(spaceY);

      var pixelData;
      if (rSpaceX < input.width && rSpaceX >= 0 && rSpaceY < input.height && rSpaceY >= 0) {
        pixelData = getPixelData(input, rSpaceX, rSpaceY);
      } else {
        pixelData = config.fallbackColor;
      }

      putPixelData(target, pixelData, screenX, screenY);
      spaceX += dx;
      spaceY += dy;
    }
  }
}

module.exports = mode7;
