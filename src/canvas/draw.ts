function dpr() {
  return window.devicePixelRatio || 1;
}

function thinLineWidth() {
  return dpr() - 0.5;
}

export function npx(px: string | number) {
  if (typeof px === 'number') return px * dpr()
  else return parseInt(px, 10) * dpr();
}

export function npxLine(px: string) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

type TextAlign =
  'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom'
type StringTupple = [string, string]
type XysTupple = [[number, number], [number, number]]
interface DrawBoxBorder {
  top: [string, string],
  bottom: [string, string],
  right: [string, string],
  left: [string, string],
}

export class DrawBox {

  x: number
  y: number
  width: number
  height: number
  padding: number
  bgColor: string
  borderTop?: StringTupple
  borderRight?: StringTupple
  borderBottom?: StringTupple
  borderLeft?: StringTupple

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    padding = 0
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.bgColor = '#ffffff'
    this.padding = padding
  }

  setBorders(borders: DrawBoxBorder) {
    this.borderTop = borders.top
    this.borderLeft = borders.left
    this.borderLeft = borders.left
    this.borderRight = borders.right
  }
  get innerWidth() {
    return this.width - (this.padding * 2) - 2;
  }

  get innerHeight() {
    return this.height - (this.padding * 2) - 2;
  }

  textx(align: TextAlign) {
    const { width, padding } = this;
    let { x } = this;
    if (align === 'left') {
      x += padding;
    } else if (align === 'center') {
      x += width / 2;
    } else if (align === 'right') {
      x += width - padding;
    }
    return x;
  }

  texty(align: TextAlign, h: number) {
    const { height, padding } = this;
    let { y } = this;
    if (align === 'top') {
      y += padding;
    } else if (align === 'middle') {
      y += height / 2 - h / 2;
    } else if (align === 'bottom') {
      y += height - padding - h;
    }
    return y;
  }

  topxys(): XysTupple {
    const { x, y, width } = this;
    return [[x, y], [x + width, y]];
  }

  rightxys(): XysTupple {
    const {
      x, y, width, height,
    } = this;
    return [[x + width, y], [x + width, y + height]];
  }

  bottomxys(): XysTupple {
    const {
      x, y, width, height,
    } = this;
    return [[x, y + height], [x + width, y + height]];
  }

  leftxys(): XysTupple {
    const {
      x, y, height,
    } = this;
    return [[x, y], [x, y + height]];
  }

}

type FontLineType =
  'underline'
  | 'bottom'
  | 'top'
  | 'strike'
  | 'center'
  | 'right'

function drawFontLine(
  type: FontLineType,
  tx: number,
  ty: number,
  align: string,
  valign: string,
  blheight: number,
  blwidth: number
): XysTupple {
  const floffset = { x: 0, y: 0 };
  if (type === 'underline') {
    if (valign === 'bottom') {
      floffset.y = 0;
    } else if (valign === 'top') {
      floffset.y = -(blheight + 2);
    } else {
      floffset.y = -blheight / 2;
    }
  } else if (type === 'strike') {
    if (valign === 'bottom') {
      floffset.y = blheight / 2;
    } else if (valign === 'top') {
      floffset.y = -((blheight / 2) + 2);
    }
  }

  if (align === 'center') {
    floffset.x = blwidth / 2;
  } else if (align === 'right') {
    floffset.x = blwidth;
  }

  return [[tx - floffset.x, ty - floffset.y], [tx - floffset.x + blwidth, ty - floffset.y]];
}

type ListKeys<T> = keyof T
type TypedKeyVal<T> = {
  [key in ListKeys<T>]: T[key]
}
interface TypeAttribute {
  align: CanvasTextAlign,
  valign: CanvasTextBaseline,
  font: string
  color: string | CanvasGradient | CanvasPattern
  fontLineType: FontLineType
}

export class Draw {
  el: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null

  constructor(
    el: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    this.el = el
    this.ctx = el.getContext('2d')
    this.resize(width, height)
  }

  resize(width: number, height: number) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx?.clearRect(0, 0, width, height);
    return this;
  }

  attr(option: Partial<TypedKeyVal<CanvasRenderingContext2D>>) {
    if (this.ctx)
      this.ctx = { ...this.ctx, ...option }
    return this;
  }

  save() {
    this.ctx?.save();
    this.ctx?.beginPath();
    return this;
  }

  restore() {
    this.ctx?.restore();
    return this;
  }

  beginPath() {
    this.ctx?.beginPath();
    return this;
  }

  translate(x: number, y: number) {
    this.ctx?.translate(npx(x), npx(y));
    return this;
  }

  scale(x: number, y: number) {
    this.ctx?.scale(x, y);
    return this;
  }

  clearRect(x: number, y: number, w: number, h: number) {
    this.ctx?.clearRect(x, y, w, h);
    return this;
  }

  fillRect(x: number, y: number, w: number, h: number) {
    this.ctx?.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  fillText(text: string, x: number, y: number) {
    this.ctx?.fillText(text, npx(x), npx(y));
    return this;
  }

  text(
    mtxt: string,
    box: DrawBox,
    attr: TypeAttribute,
    textWrap: boolean = true
  ) {
    const { ctx } = this;
    const {
      align, valign, font, color, fontLineType
    } = attr;

    this.attr({
      textAlign: align,
      textBaseline: valign,
      fillStyle: color,
      // TODO: object font need DataProxy class to build up
      strokeStyle: color
    })

  }

}

