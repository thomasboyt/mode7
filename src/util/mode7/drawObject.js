/* @flow */

type Mode7Config = {
  horizon: number;
  spaceZ: number;
  scaleX: number;
  scaleY: number;
  objScaleX: number;
  objScaleY: number;
  fallbackColor: [number, number, number, number]
};

type Rectangle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * Based off of:
 * http://helixsoft.nl/articles/circle/sincos.htm
 *
 * Params:
 *   - ctx [CanvasRenderingContext2D]
 *   - targetSize[object]: A rectangle representing the rendered-into area
 *       - x
 *       - y
 *       - w
 *       - h
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
function drawObject(ctx: any,
                    targetSize: Rectangle,
                    img: ImageData,
                    imageParams: Rectangle,
                    cx: number,
                    cy: number,
                    angle: number,
                    objX: number,
                    objY: number,
                    config: Mode7Config) {

  // calculate position relative to camera
  objX = objX - cx;
  objY = objY - cy;

  // rotate object by camera space
  var spaceX = objX * Math.cos(angle) + objY * Math.sin(angle);
  var spaceY = -objX * Math.sin(angle) + objY * Math.cos(angle);

  // calculate the screen coordinates that go with these space coordinates
  // by dividing everything by spaceX (the distance)
  var screenX = targetSize.w / 2 + Math.round(config.scaleX / spaceX * spaceY);
  var screenY = Math.round(config.spaceZ * config.scaleY / spaceX) - config.horizon;

  // the size of the object has to be scaled according to the distance
  var width = Math.round(targetSize.w * (config.objScaleX / spaceX));
  var height = Math.round(targetSize.h * (config.objScaleY / spaceX));

  // draw the object
  ctx.drawImage(img, imageParams.x, imageParams.y, imageParams.w, imageParams.h,
                targetSize.x + (screenX - width / 2), targetSize.y + (screenY - height), width, height);
}

module.exports = drawObject;
