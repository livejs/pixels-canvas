var genfun = require('generate-function')

module.exports = pixelsToCanvas

function pixelsToCanvas (canvas) {
  var ctx = canvas.getContext('2d')

  function compileRender (ctx, format, shape) {
    var width = canvas.width / shape[0]
    var height = canvas.height / shape[1]
    var colorStyle = compileColorStyle(format)

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

function compileColorStyle (format) {
  var colorStyle
  if (format === 'keyword') {
    colorStyle = genfun()
      ('function (color) {')
        ('return color.get(0)')
      ('}')
  } else if (format === 'rgba') {
    colorStyle = genfun()
      ('function (color) {')
        ('return "rgb("+ ~~color.get(0) + "," + ~~color.get(1) + "," + ~~color.get(2) + ")"')
      ('}')
  } else if (format === 'rgba') {
    colorStyle = genfun()
      ('function (color) {')
        ('return "rgba("+ ~~color.get(0) + "," + ~~color.get(1) + "," + ~~color.get(2)) + "," + color.get(3) + ")"')
      ('}')
  } else if (format === 'hsl') {
    colorStyle = genfun()
      ('function (color) {')
        ('return "hsl("+ color.get(0) + "," + color.get(1) + "%," + color.get(2) + "%)"')
      ('}')
  } else if (format === 'hsla') {
    colorStyle = genfun()
      ('function (color) {')
        ('return "hsl("+ color.get(0) + "," + color.get(1) + "%," + color.get(2) + "%," + color.get(3) + ")"')
      ('}')
  } else {
    throw new Error('2dpixels-canvas: unsupported color format: ', format)
  }
  return colorStyle.toFunction()
}
