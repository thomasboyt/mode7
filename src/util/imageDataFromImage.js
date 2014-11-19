/* @flow */

// draw an Image object to an in-memory canvas, and return the resulting ImageData
function imageDataFromImage(img: Image): ImageData {

  // TODO: this is cast to `any` because there's no declaration for HTMLCanvasElement yet :<
  var canvas : any = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}

module.exports = imageDataFromImage;
