import helper from './helper';

interface ColData {
  width?: number;
  hide?: boolean;
  style?: string;
}

interface ColsConstructorParams {
  len: number;
  width: number;
  indexWidth: number;
  minWidth: number;
}

class Cols {
  private _: { [key: number]: ColData };
  len: number;
  width: number;
  indexWidth: number;
  minWidth: number;

  constructor({ len, width, indexWidth, minWidth }: ColsConstructorParams) {
    this._ = {};
    this.len = len;
    this.width = width;
    this.indexWidth = indexWidth;
    this.minWidth = minWidth;
  }

  setData(d: { len?: number;[key: number]: ColData }): void {
    if (d.len) {
      this.len = d.len;
      delete d.len;
    }
    this._ = d;
  }

  getData(): { len: number;[key: number]: ColData } {
    const { len } = this;
    return Object.assign({ len }, this._);
  }

  getWidth(i: number): number {
    if (this.isHide(i)) return 0;
    const col = this._[i];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  getOrNew(ci: number): ColData {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  setWidth(ci: number, width: number): void {
    const col = this.getOrNew(ci);
    col.width = width;
  }

  unhide(idx: number): void {
    let index = idx;
    while (index > 0) {
      index -= 1;
      if (this.isHide(index)) {
        this.setHide(index, false);
      } else break;
    }
  }

  isHide(ci: number): boolean {
    const col = this._[ci];
    return col && (col.hide ?? false);
  }

  setHide(ci: number, v: boolean): void {
    const col = this.getOrNew(ci);
    if (v === true) col.hide = true;
    else delete col.hide;
  }

  setStyle(ci: number, style: string): void {
    const col = this.getOrNew(ci);
    col.style = style;
  }

  sumWidth(min: number, max: number): number {
    return helper.rangeSum(min, max, (i: number) => this.getWidth(i));
  }

  totalWidth(): number {
    return this.sumWidth(0, this.len);
  }
}

export default {};
export {
  Cols,
};
