var colorStyles = require('color-style')

module.exports = pixelsToCanvas

function pixelsToCanvas (canvas) {
  var ctx = canvas.getContext('2d')

  // TODO actually compile function
  function compileRender (ctx, format, shape) {
    var width = canvas.width / shape[0]
    var height = canvas.height / shape[1]

    return function (x, y, color) {
      ctx.fillStyle = colorStyle(format, color)
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

function colorStyle (format, color) {
  var toStyle = colorStyles[format]
  if (color.size === 3) {
    return toStyle(color.get(0), color.get(1), color.get(2))
  } else if (color.size === 4) {
    return toStyle(color.get(0), color.get(1), color.get(2), color.get(3))
  }
}
