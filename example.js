var rainbowPixels = require('rainbow-pixels')
var raf = require('pull-raf')
var pull = require('pull-stream')

var canvas = document.createElement('canvas')
var pixelsToCanvas = require('./')(canvas)

document.body.appendChild(canvas)

pull(
  rainbowPixels({
    shape: [
      Math.floor(document.body.clientWidth / 16),
      Math.floor(document.body.clientHeight / 16)
    ]
  }),
  raf(),
  pull.map(function (pixels) {
    pixelsToCanvas(pixels)
  }),
  pull.drain()
)
