var cwise = require('cwise')
var genfun = require('generate-function')
var colorStyles = require('pixel-to-css-color')
var Ndpixels = require('ndpixels')
var Tc = require('tcomb')

//module.exports = Tc.func([Ndpixels], Tc.Nil)
//  .of(createPixelsToCanvasRenderer)
module.exports = createPixelsToCanvasRenderer

function createPixelsToCanvasRenderer (canvas) {
  var ctx = canvas.getContext('2d')

  return function updateCanvas (pixels) {
    render(ctx, pixels)
  }
}

var iteration = cwise({
  args: ['scalar', 'scalar', 'scalar', 'shape', 'index', { blockIndices: -1 }],
  body: function (ctx, fillStyle, fillRect, shape, index, pixel) {
    fillStyle(pixel[0], pixel[1], pixel[2], pixel[3])
    fillRect(index[0], index[1])
  },
  funcName: 'iteratePixels'
})

function render (ctx, pixels) {
  var fillStyle = genFillStyle(ctx, pixels.format)
  var fillRect = genFillRect(ctx, pixels.shape)

  return iteration(ctx, fillStyle, fillRect, pixels)
}

function genFillStyle (ctx, format) {
  var toCss = colorStyles[format]

  if (toCss == null) {
    throw new Error('pixels-canvas: unsupported color format: ', format)
  }

  var fn
  switch (format) {
    case 'keyword':
      fn = genfun('function fillStyle (a) { ctx.fillStyle = toCss(a) }')
      break;
    case 'rgb':
    case 'hsl':
      fn = genfun('function fillStyle (a, b, c) { ctx.fillStyle = toCss(a, b, c) }')
      break;
    case 'hsla':
    case 'rgba':
      fn = genfun('function fillStyle (a, b, c, d) { ctx.fillStyle = toCss(a, b, c, d) }')
      break;
  }

  return fn.toFunction({ ctx: ctx, toCss: toCss })
}

function genFillRect (ctx, shape) {
  var dimension = shape.length - 1
  var width, height
  switch (dimension) {
    case 2:
      width = ctx.canvas.width / shape[0]
      height = ctx.canvas.height / shape[1]
      break;
    case 1:
      width = ctx.canvas.width / shape[0]
      height = 1
      break;
    default:
      width = 1
      height = 1
  }

  var fn
  switch (dimension) {
    case -1:
    case 0:
      fn = genfun('function fillRect () { ctx.fillRect(0, 0, %d, %d) }', width, height)
      break
    case 1:
      fn = genfun('function fillRect (x) { ctx.fillRect(x * %d, 0, %d, %d) }', width, width, height)
      break
    case 2:
      fn = genfun('function fillRect (x, y) { ctx.fillRect(x * %d, y * %d, %d, %d) }', width, height, width, height)
      break
    default:
      throw new Error('pixels-canvas: cannot iterate in ' + dimension + ' dimensions')
  }

  return fn.toFunction({ ctx: ctx })
}
