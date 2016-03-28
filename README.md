# pixels-canvas

canvas renderer for [pixels](https://github.com/livejs/pixels)

```shell
npm install --save pixels-canvas
```

## usage

### `toCanvas = require('pixels-canvas')`

### `pixelsToCanvas = toCanvas(canvas)`

`canvas`: required canvas dom element

### `pixelsToCanvas(pixels)`

`pixels`: required [2d pixels](https://github.com/livejs/ndpixels)

## example

```js
var toCanvas = require('pixels-canvas')

var pixelsToCanvas = toCanvas(canvas)

document.body.appendChild(canvas)

pixelsToCanvas(pixels)
```

for a full example, see [./example](http://livejs.github.io/pixels-canvas)

## License

The Apache License

Copyright &copy; 2016 Michael Williams (@ahdinosaur)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
