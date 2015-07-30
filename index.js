var genfun = require('generate-function')
var colorStyles = require('pixel-to-css-color')

module.exports = pixelsToCanvas

function pixelsToCanvas (canvas) {
  var ctx = canvas.getContext('2d')

  function compileRender (ctx, format, shape) {
    var width = canvas.width / shape[0]
    var height = canvas.height / shape[1]
    var colorStyle = colorStyles[format]

    if (colorStyle == null) {
      throw new Error('2dpixels-canvas: unsupported color format: ', format)
    }

    var render = genfun()
      ('function (x, y, color) {')
        ('ctx.fillStyle = colorStyle(color)')
        ('ctx.fillRect(x * %d, y * %d, %d, %d)', width, height, width, height)
      ('}')

    return render.toFunction({
      ctx: ctx,
      colorStyle: colorStyle
    })
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
