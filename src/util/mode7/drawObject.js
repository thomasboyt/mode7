/**
 * Based off of:
 * http://helixsoft.nl/articles/circle/sincos.htm
 *
 * Params:
 *   - ctx [CanvasRenderingContext2D]
 *   - img [ImageData]    The Image to render
 *   - imageParams [object]:
 *       - x
 *       - y
 *       - w
 *       - h
 *   - cx, cx [int]       The camera position
 *   - angle [int]        The camera angle (in radians)
 *   - objX, objY [int]   The object's position
 *   - config [object]:
 *       - spaceZ [int]           Height of the camera above the plane
 *       - scaleX, scaleY [int]   Scale of space coordinates to screen coordinates
 *       - horizon [int]          Horizon location on the screen
 *       - objScaleX [int]
 *       - objScaleY [int]
 */
function drawObject(ctx, img, imageParams, cx, cy, angle, objX, objY, config) {

  // calculate position relative to camera
  objX = objX - cx;
  objY = objY - cy;

  // rotate object by camera space
  var spaceX = objX * Math.cos(angle) + objY * Math.sin(angle);
  var spaceY = -objX * Math.sin(angle) + objY * Math.cos(angle);

  // calculate the screen coordinates that go with these space coordinates
  // by dividing everything by spaceX (the distance)
  var screenX = ctx.canvas.width / 2 + Math.round(config.scaleX / spaceX * spaceY);
  var screenY = Math.round(config.spaceZ * config.scaleY / spaceX) - config.horizon;

  // the size of the object has to be scaled according to the distance
  var height = Math.round(ctx.canvas.height * (config.objScaleY / spaceX));
  var width = Math.round(ctx.canvas.width * (config.objScaleX / spaceX));

  // draw the object
  ctx.drawImage(img, imageParams.x, imageParams.y, imageParams.w, imageParams.h,
                screenX - width / 2, screenY - height, width, height);
}

module.exports = drawObject;
