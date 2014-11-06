(function() {

function mode7(imgData) {
  return imgData;
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

  imgData = mode7(imgData);

  var ctx = canvas.getContext('2d');
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

