var colorStyles = require('color-style')

module.exports = pixelsToCanvas

function pixelsToCanvas (canvas) {
  var ctx = canvas.getContext('2d')

  // TODO actually compile function
  function compileRender (ctx, format, shape) {
    var width = canvas.width / shape[0]
    var height = canvas.height / shape[1]
    var colorStyle = compileColorStyle(format)

    return function (x, y, color) {
      console.log(colorStyle(color))
      ctx.fillStyle = colorStyle(color)
      ctx.fillRect(x * width, y * height, width, height)
    }
  }

  return function updateCanvas (pixels) {
    var render = compileRender(ctx, pixels.format, pixels.shape)

    for (var x = 0; x < pixels.shape[0]; x++) {
      for (var y = 0; y < pixels.shape[1]; y++) {
        render(x, y, pixels.pick(x, y))
      }
    }
  }
}

// TODO actually compile function
function compileColorStyle (format) {
  var toStyle = colorStyles[format]
  var fmt = format.slice(0, 3)
  if (format === 'keyword') {
    return function (color) { return color.get(0) }
  } else if (fmt === 'rgb' || fmt === 'hsl') {
    if (format[3] === 'a') {
      return function (color) {
        return toStyle(color.get(0), color.get(1), color.get(2), color.get(3))
      }
    }
    return function (color) {
      return toStyle(color.get(0), color.get(1), color.get(2))
    }
  } else {
    throw new Error('2dpixels-canvas: unsupported color format: ', format)
  }
}
