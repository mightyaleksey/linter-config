/* @flow */

import emptyFunction from './libs/emptyFunction.mjs'

const _frameRate = 60
const _minFrameTime = 1 / _frameRate
const _maxFrameTime = 1
const _scale = window.innerWidth <= 440 ? 1.6 : 3
const _state: { buffer: HTMLCanvasElement, context: CanvasRenderingContext2D } =
  // $FlowExpectedError[incompatible-type]
  { buffer: null, context: null }

const _input: {
  resized: boolean,
  touched: boolean,
  touches: { [string]: [number, number] }
} = { resized: false, touched: false, touches: {} }

type AlignMode = 'center' | 'left' | 'right'

/**
 * Shared type for the mode argument to be used
 * for various shapes drawing
 */
type DrawMode = 'fill' | 'line'

/**
 * Helper to check available space.
 * Returns virtual resolution.
 */
export const Dimentions = { width: 0, height: 0 }

export const Touch = {
  getPosition (id?: ?string): ?[number, number] {
    if (id == null) id = Object.keys(_input.touches)[0]
    // $FlowExpectedError[incompatible-type]: missing null check
    return _input.touches[id] ?? null
  },

  getTouches (): $ReadOnlyArray<string> {
    return Object.keys(_input.touches)
  },

  wasTouched (): boolean {
    return _input.touched
  }
}

export function clear () {
  const b = _state.buffer
  const c = _state.context
  c.clearRect(0, 0, b.width, b.height)
}

export function circle (mode: DrawMode, x: number, y: number, radius: number) {
  const c = _state.context
  c.beginPath()
  c.arc(x, y, radius, 0, 2 * Math.PI)
  mode === 'fill' ? c.fill() : c.stroke()
}

export function draw (
  drawable: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const c = _state.context
  c.drawImage(
    drawable,
    0,
    0,
    drawable.width,
    drawable.height,
    Math.floor(x),
    Math.floor(y),
    Math.floor(w),
    Math.floor(h)
  )
}

export function ellipse (
  mode: DrawMode,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation: number
) {
  const c = _state.context
  c.beginPath()
  c.ellipse(x, y, radiusX, radiusY, (rotation * Math.PI) / 180, 0, 2 * Math.PI)
  mode === 'fill' ? c.fill() : c.stroke()
}

export function getTextWidth (text: string): number {
  const c = _state.context
  return c.measureText(text).width
}

export function line (x0: number, y0: number, x1: number, y1: number) {
  const c = _state.context
  c.beginPath()
  c.moveTo(x0, y0)
  c.lineTo(x1, y1)
  c.stroke()
}

export function printf (
  text: string,
  x: number,
  y: number,
  limit?: ?number,
  align?: AlignMode
) {
  const c = _state.context
  limit = limit ?? Dimentions.width - x

  const width = getTextWidth(text)
  const dx =
    align === 'right'
      ? limit - width
      : align === 'center'
        ? 0.5 * (limit - width)
        : 0

  c.fillText(text, Math.floor(x + dx), Math.floor(y), limit)
}

export function putImageData (data: ImageData, x: number, y: number) {
  const c = _state.context
  c.putImageData(data, x, y)
}

export function rect (
  mode: DrawMode,
  x: number,
  y: number,
  width: number,
  height: number,
  radius?: number
) {
  const c = _state.context
  c.beginPath()
  c.roundRect(
    Math.floor(x),
    Math.floor(y),
    Math.floor(width),
    Math.floor(height),
    radius ?? 0
  )
  mode === 'fill' ? c.fill() : c.stroke()
}

export function restore () {
  _state.context.restore()
}

export function rotate (degree: number) {
  const c = _state.context
  c.rotate((degree * Math.PI) / 180)
}

export function setColor (color: string, opacity?: number) {
  const c = _state.context
  c.fillStyle = color
  c.strokeStyle = color
  c.globalAlpha = opacity ?? 1
}

export function setFont (font: number | string) {
  const c = _state.context
  c.font = typeof font === 'number' ? c.font.replace(/\d+/, String(font)) : font
}

export function setLine (width: number) {
  const c = _state.context
  c.lineWidth = width
}

export function translate (dx: number, dy: number) {
  const c = _state.context
  c.translate(Math.floor(dx), Math.floor(dy))
}

export function wasResized (): boolean {
  return _input.resized
}

export async function createEngine (
  initGame?: ?() => Promise<void>,
  updateGame?: ?(delta: number) => void,
  renderGame?: ?() => void
) {
  _updateDimentions()
  if (initGame != null) await initGame()

  // normalize input
  const render = renderGame ?? emptyFunction
  const update: (number) => void = updateGame ?? emptyFunction

  const c = createCanvas()
  _state.buffer = c[0]
  _state.context = c[1]

  document.body?.appendChild(_state.buffer)
  ;(function gameLoop (previousFrame: number) {
    const currentFrame = _getTime()
    const delta = currentFrame - previousFrame

    if (delta >= _maxFrameTime) {
      // skip update if too much time passed
      previousFrame = currentFrame
    } else if (delta >= _minFrameTime) {
      previousFrame = currentFrame

      // update game state
      update(delta)
      _normalizeCanvas()
      _updateDimentions()

      clear()
      // save and restore helps to reset "translate" changes
      _state.context.save()
      render()
      _state.context.restore()

      _input.resized = false
      _input.touched = false
    }

    window.requestAnimationFrame(() => {
      gameLoop(previousFrame)
    })
  })(_getTime())

  document.addEventListener('click', onClick)
  document.addEventListener('touchstart', onTouch)
  document.addEventListener('touchmove', onTouch)
  document.addEventListener('touchend', onTouchEnd)
  window.addEventListener('resize', onReisze)

  function onClick (event: MouseEvent) {
    _preventDefault(event)

    if (event.button === 0) {
      _input.touched = true
      _input.touches.mouse = [event.pageX / _scale, event.pageY / _scale]
    }
  }

  function onTouch (event: TouchEvent) {
    _preventDefault(event)

    _input.touched = true

    for (let t = 0; t < event.changedTouches.length; t++) {
      const touchEvent = event.changedTouches[t]
      _input.touches[String(touchEvent.identifier)] = [
        touchEvent.pageX / _scale,
        touchEvent.pageY / _scale
      ]
    }
  }

  function onTouchEnd (event: TouchEvent) {
    _preventDefault(event)

    for (let t = 0; t < event.changedTouches.length; t++) {
      const touchEvent = event.changedTouches[t]
      delete _input.touches[String(touchEvent.identifier)]
    }
  }

  function onReisze () {
    _input.resized = true
  }

  function _preventDefault (event: UIEvent) {
    event.preventDefault()
  }
}

export function genQuads (
  atlas: HTMLImageElement,
  width: number,
  height: number
): $ReadOnlyArray<HTMLImageElement> {
  const quads = []
  const [canvas, canvasContext] = createCanvas(width, height)

  for (let y = 0; y < atlas.height; y += height) {
    for (let x = 0; x < atlas.width; x += width) {
      canvasContext.clearRect(0, 0, width, height)
      canvasContext.drawImage(atlas, -x, -y)

      const image = new window.Image()
      image.src = canvas.toDataURL('image/png')

      quads.push(image)
    }
  }

  return quads
}

export function newImage (url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load image: '${url}'`))
    image.src = url
  })
}

/**
 * Helpers
 */

export function createCanvas (
  width?: number,
  height?: number
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas')
  if (width != null && height != null) {
    canvas.width = width
    canvas.height = height
  }

  const context = canvas.getContext('2d')
  context.imageSmoothingEnabled = false
  context.font = '8px Consolas, monaco, monospace'
  context.textBaseline = 'top'

  return [canvas, context]
}

function _normalizeCanvas () {
  _state.buffer.width = window.innerWidth
  _state.buffer.height = window.innerHeight
  _state.context.scale(_scale, _scale)
}

function _getTime (): number {
  return 0.001 * Date.now()
}

function _updateDimentions () {
  Dimentions.width = Math.ceil(window.innerWidth / _scale)
  Dimentions.height = Math.ceil(window.innerHeight / _scale)
}
