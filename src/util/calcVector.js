/* @flow */

type Coordinates = {
  x: number;
  y: number;
};

module.exports = function calcVector(magnitude: number, angle: number): Coordinates {
  var rad = angle * Math.PI/180;
  var x = magnitude * Math.cos(rad);
  var y = magnitude * Math.sin(rad);
  return { x: x, y: y };
};
