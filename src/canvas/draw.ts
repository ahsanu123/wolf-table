function dpr() {
  return window.devicePixelRatio || 1;
}

export function thinLineWidth() {
  return dpr() - 0.5;
}

export function npx(px: string | number) {
  if (typeof px === 'number') return px * dpr()
  else return parseInt(px, 10) * dpr();
}

export function npxLine(px: string | number) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

type TextAlign =
  CanvasTextAlign
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom'

type BorderStyleTupple = [DrawBorderStyle, DrawBorderStyle]
type XysTupple = [[number, number], [number, number]]
interface DrawBoxBorder {
  top: BorderStyleTupple
  bottom: BorderStyleTupple,
  right: BorderStyleTupple,
  left: BorderStyleTupple,
}

export class DrawBox {

  x: number
  y: number
  width: number
  height: number
  padding: number
  bgColor: string
  borderTop?: BorderStyleTupple
  borderRight?: BorderStyleTupple
  borderBottom?: BorderStyleTupple
  borderLeft?: BorderStyleTupple

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

export interface DrawSetting {
  mode: 'edit' | 'read',
  view: {
    height: () => number,
    width: () => number,
  },
  showGrid: boolean,
  showToolbar: boolean,
  showContextmenu: boolean,
  showBottomBar: boolean,

  row: {
    len: number,
    height: number,
  },
  col: {
    len: number,
    width: number,
    indexWidth: number,
    minWidth: number,
  },
  style: {
    bgcolor: string,
    align: CanvasTextAlign,
    valign: CanvasTextBaseline,
    textwrap: boolean,
    strike: boolean,
    underline: boolean,
    color: string,
    format: string,
    font: DrawFontSetting
  },
}

type DrawFontSetting = {
  name: string,
  size: number,
  bold: boolean,
  italic: boolean,
  underline: boolean,
  strike: boolean,
}

interface TypeAttribute {
  align: CanvasTextAlign,
  valign: CanvasTextBaseline,
  font: DrawFontSetting,
  color: string | CanvasGradient | CanvasPattern
}

type DrawBorderStyle = 'medium' | 'thick' | 'dashed' | 'dotted' | 'double'

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
      align, valign, font, color
    } = attr;
    if (!ctx) return

    const tx = box.textx(align);
    ctx.save();
    ctx.beginPath();
    this.attr({
      textAlign: align,
      textBaseline: valign,
      fillStyle: color,
      font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
      strokeStyle: color
    })

    const txts = `${mtxt}`.split('\n');
    const biw = box.innerWidth;
    const ntxts: string[] = [];

    txts.forEach((it) => {
      const txtWidth = ctx?.measureText(it).width;
      if (txtWidth && textWrap && txtWidth > npx(biw)) {
        let textLine = { w: 0, len: 0, start: 0 };
        for (let i = 0; i < it.length; i += 1) {
          if (textLine.w >= npx(biw)) {
            ntxts.push(it.substring(textLine.start, textLine.len + textLine.start));
            textLine = { w: 0, len: 0, start: i };
          }
          textLine.len += 1;
          textLine.w += ctx.measureText(it[i]).width + 1;
        }
        if (textLine.len > 0) {
          ntxts.push(it.substring(textLine.start, textLine.len + textLine.start));
        }
      } else {
        ntxts.push(it);
      }
    });

    const txtHeight = (ntxts.length - 1) * (font.size + 2);

    let ty = box.texty(valign as TextAlign, txtHeight);
    ntxts.forEach((txt) => {
      const txtWidth = ctx.measureText(txt).width;
      this.fillText(txt, tx, ty);
      if (font.strike) {
        const strike = drawFontLine('strike', tx, ty, align, valign, font.size, txtWidth);
        this.line(strike)
      }
      if (font.underline) {
        const underline = drawFontLine('underline', tx, ty, align, valign, font.size, txtWidth);
        this.line(underline)
      }
      ty += font.size + 2;
    });
    ctx.restore();
    return this;

  }

  border(
    style: DrawBorderStyle,
    color: string | CanvasGradient | CanvasPattern
  ) {
    const { ctx } = this;
    if (!ctx) return
    ctx.lineWidth = thinLineWidth();
    ctx.strokeStyle = color;
    // console.log('style:', style);
    if (style === 'medium') {
      ctx.lineWidth = npx(2) - 0.5;
    } else if (style === 'thick') {
      ctx.lineWidth = npx(3);
    } else if (style === 'dashed') {
      ctx.setLineDash([npx(3), npx(2)]);
    } else if (style === 'dotted') {
      ctx.setLineDash([npx(1), npx(1)]);
    } else if (style === 'double') {
      ctx.setLineDash([npx(2), 0]);
    }
    return this;
  }

  line(xys: XysTupple) {
    const { ctx } = this;

    if (ctx && xys.length > 1) {
      ctx.beginPath();
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1; i < xys.length; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }

  strokeBorders(box: DrawBox) {
    const { ctx } = this;
    if (!ctx) return
    ctx.save();
    const {
      borderTop, borderRight, borderBottom, borderLeft,
    } = box;

    if (borderTop) {
      this.border(...borderTop);
      this.line(box.topxys());
    }
    if (borderRight) {
      this.border(...borderRight);
      this.line(box.rightxys());
    }
    if (borderBottom) {
      this.border(...borderBottom);
      this.line(box.bottomxys());
    }
    if (borderLeft) {
      this.border(...borderLeft);
      this.line(box.leftxys());
    }
    ctx.restore();
  }

  dropdown(box: DrawBox) {
    const { ctx } = this;
    if (!ctx) return
    const {
      x, y, width, height,
    } = box;
    const sx = x + width - 15;
    const sy = y + height - 15;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx), npx(sy));
    ctx.lineTo(npx(sx + 8), npx(sy));
    ctx.lineTo(npx(sx + 4), npx(sy + 6));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 0, 0, .45)';
    ctx.fill();
    ctx.restore();
  }

  error(box: DrawBox) {
    const { ctx } = this;
    if (!ctx) return

    const { x, y, width } = box;
    const sx = x + width - 1;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 0, 0, .65)';
    ctx.fill();
    ctx.restore();
  }

  frozen(box: DrawBox) {
    const { ctx } = this;
    if (!ctx) return

    const { x, y, width } = box;
    const sx = x + width - 1;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(npx(sx - 8), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y - 1));
    ctx.lineTo(npx(sx), npx(y + 8));
    ctx.closePath();
    ctx.fillStyle = 'rgba(0, 255, 0, .85)';
    ctx.fill();
    ctx.restore();
  }

  rect(box: DrawBox, drawBoxCb: () => void) {
    const { ctx } = this;
    if (!ctx) return

    const {
      x, y, width, height, bgColor,
    } = box;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = bgColor || '#fff';
    ctx.rect(npxLine(x + 1), npxLine(y + 1), npx(width - 2), npx(height - 2));
    ctx.clip();
    ctx.fill();
    drawBoxCb();
    ctx.restore();
  }
}

