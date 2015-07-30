var rainbowPixels = require('rainbow-pixels')
var through = require('through2')
var raf = require('raf')

var canvas = document.createElement('canvas')
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
document.body.appendChild(canvas)

var pixelsToCanvas = require('./')(canvas)

rainbowPixels({
  shape: [
    Math.floor(canvas.width / 16),
    Math.floor(canvas.height / 16)
  ],
  inc: 1
})
.pipe(through.obj({
  highWaterMark: 1
}, function (pixels, enc, cb) {
  raf(function () {
    pixelsToCanvas(pixels)
    cb()
  })
}))
