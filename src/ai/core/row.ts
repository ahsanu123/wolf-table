import helper from './helper';
import { expr2expr } from './alphabet';

interface Row {
  height: number;
  hide: boolean;
  style: any;
  cells: { [key: string]: any };
}

interface Cell {
  text?: string;
  style?: any;
  merge?: number[];
  editable?: boolean;
  value?: string;
}

interface CellRange {
  sri: number;
  sci: number;
  eri: number;
  eci: number;
  size: () => [number, number];
  includes: (ri: number, ci: number) => boolean;
  each: (cb: (i: number, j: number) => void) => void;
}

interface RowsConstructorParams {
  len: number;
  height: number;
}

class Rows {
  private _: { [key: number]: Row };
  private len: number;
  private height: number;

  constructor({ len, height }: RowsConstructorParams) {
    this._ = {};
    this.len = len;
    this.height = height;
  }

  getHeight(ri: number): number {
    if (this.isHide(ri)) return 0;
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  setHeight(ri: number, v: number): void {
    const row = this.getOrNew(ri);
    row.height = v;
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

  isHide(ri: number): boolean {
    const row = this.get(ri);
    return (row && row.hide) as false;
  }

  setHide(ri: number, v: boolean): void {
    const row = this.getOrNew(ri);
    if (v === true) row.hide = true;
    else row.hide = false;
  }

  setStyle(ri: number, style: any): void {
    const row = this.getOrNew(ri);
    row.style = style;
  }

  sumHeight(min: number, max: number, exceptSet?: Set<number>): number {
    return helper.rangeSum(min, max, (i: number) => {
      if (exceptSet && exceptSet.has(i)) return 0;
      return this.getHeight(i);
    });
  }

  totalHeight(): number {
    return this.sumHeight(0, this.len);
  }

  get(ri: number): Row | undefined {
    return this._[ri];
  }

  getOrNew(ri: number): Row {
    this._[ri] = this._[ri] || { cells: {} };
    return this._[ri];
  }

  getCell(ri: number, ci: number): Cell | null {
    const row = this.get(ri);
    if (row !== undefined && row.cells !== undefined && row.cells[ci] !== undefined) {
      return row.cells[ci];
    }
    return null;
  }

  getCellMerge(ri: number, ci: number): number[] {
    const cell = this.getCell(ri, ci);
    if (cell && cell.merge) return cell.merge;
    return [0, 0];
  }

  getCellOrNew(ri: number, ci: number): Cell {
    const row = this.getOrNew(ri);
    row.cells[ci] = row.cells[ci] || {};
    return row.cells[ci];
  }

  setCell(ri: number, ci: number, cell: Cell, what: 'all' | 'text' | 'format' | 'merge' = 'all'): void {
    const row = this.getOrNew(ri);
    if (what === 'all') {
      row.cells[ci] = cell;
    } else if (what === 'text') {
      row.cells[ci] = row.cells[ci] || {};
      row.cells[ci].text = cell.text;
    } else if (what === 'format') {
      row.cells[ci] = row.cells[ci] || {};
      row.cells[ci].style = cell.style;
      if (cell.merge) row.cells[ci].merge = cell.merge;
    }
  }

  setCellText(ri: number, ci: number, text: string): void {
    const cell = this.getCellOrNew(ri, ci);
    if (cell.editable !== false) cell.text = text;
  }

  copyPaste(srcCellRange: CellRange, dstCellRange: CellRange, what: 'all' | 'text' | 'format' | 'merge', autofill: boolean = false, cb: (nri: number, nci: number, ncell: Cell) => void = () => { }): void {
    const {
      sri, sci, eri, eci,
    } = srcCellRange;
    const dsri = dstCellRange.sri;
    const dsci = dstCellRange.sci;
    const deri = dstCellRange.eri;
    const deci = dstCellRange.eci;
    const [rn, cn] = srcCellRange.size();
    const [drn, dcn] = dstCellRange.size();
    let isAdd = true;
    let dn = 0;
    if (deri < sri || deci < sci) {
      isAdd = false;
      if (deri < sri) dn = drn;
      else dn = dcn;
    }
    for (let i = sri; i <= eri; i += 1) {
      if (this._[i]) {
        for (let j = sci; j <= eci; j += 1) {
          if (this._[i].cells && this._[i].cells[j]) {
            for (let ii = dsri; ii <= deri; ii += rn) {
              for (let jj = dsci; jj <= deci; jj += cn) {
                const nri = ii + (i - sri);
                const nci = jj + (j - sci);
                const ncell = helper.cloneDeep(this._[i].cells[j]);
                if (autofill && ncell && ncell.text && ncell.text.length > 0) {
                  const { text } = ncell;
                  let n = (jj - dsci) + (ii - dsri) + 2;
                  if (!isAdd) {
                    n -= dn + 1;
                  }
                  if (text[0] === '=') {
                    ncell.text = text.replace(/[a-zA-Z]{1,3}\d+/g, (word: string) => {
                      let [xn, yn] = [0, 0];
                      if (sri === dsri) {
                        xn = n - 1;
                      } else {
                        yn = n - 1;
                      }
                      if (/^\d+$/.test(word)) return word;
                      return expr2expr(word, xn, yn);
                    });
                  } else if ((rn <= 1 && cn > 1 && (dsri > eri || deri < sri))
                    || (cn <= 1 && rn > 1 && (dsci > eci || deci < sci))
                    || (rn <= 1 && cn <= 1)) {
                    const result = /[\\.\d]+$/.exec(text);
                    if (result !== null) {
                      const index = Number(result[0]) + n - 1;
                      ncell.text = text.substring(0, result.index) + index;
                    }
                  }
                }
                this.setCell(nri, nci, ncell, what);
                cb(nri, nci, ncell);
              }
            }
          }
        }
      }
    }
  }

  cutPaste(srcCellRange: CellRange, dstCellRange: CellRange): void {
    const ncellmm: { [key: number]: Row } = {};
    this.each((ri: number) => {
      this.eachCells(ri, (ci: number, cell: Cell) => {
        let nri = parseInt(ri.toString(), 10);
        let nci = parseInt(ci.toString(), 10);
        if (srcCellRange.includes(ri, ci)) {
          nri = dstCellRange.sri + (nri - srcCellRange.sri);
          nci = dstCellRange.sci + (nci - srcCellRange.sci);
        }
        ncellmm[nri] = ncellmm[nri] || { cells: {} };
        ncellmm[nri].cells[nci] = this._[ri].cells[ci];
      });
    });
    this._ = ncellmm;
  }

  paste(src: Array<Array<string>>, dstCellRange: CellRange): void {
    if (src.length <= 0) return;
    const { sri, sci } = dstCellRange;
    src.forEach((row: string[], i: number) => {
      const ri = sri + i;
      row.forEach((cell: string, j: number) => {
        const ci = sci + j;
        this.setCellText(ri, ci, cell);
      });
    });
  }

  insert(sri: number, n: number = 1): void {
    const ndata: { [key: number]: Row } = {};
    this.each((ri: number, row: Row) => {
      let nri = parseInt(ri.toString(), 10);
      if (nri >= sri) {
        nri += n;
        this.eachCells(ri, (ci: number, cell: Cell) => {
          if (cell.text && cell.text[0] === '=') {
            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => expr2expr(word, 0, n, (x, y) => y >= sri));
          }
        });
      }
      ndata[nri] = row;
    });
    this._ = ndata;
    this.len += n;
  }

  delete(sri: number, eri: number): void {
    const n = eri - sri + 1;
    const ndata: { [key: number]: Row } = {};
    this.each((ri: number, row: Row) => {
      const nri = parseInt(ri.toString(), 10);
      if (nri < sri) {
        ndata[nri] = row;
      } else if (ri > eri) {
        ndata[nri - n] = row;
        this.eachCells(ri, (ci: number, cell: Cell) => {
          if (cell.text && cell.text[0] === '=') {
            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => expr2expr(word, 0, -n, (x, y) => y > eri));
          }
        });
      }
    });
    this._ = ndata;
    this.len -= n;
  }

  insertColumn(sci: number, n: number = 1): void {
    this.each((ri: number, row: Row) => {
      const rndata: { [key: number]: Cell } = {};
      this.eachCells(ri, (ci: number, cell: Cell) => {
        let nci = parseInt(ci.toString(), 10);
        if (nci >= sci) {
          nci += n;
          if (cell.text && cell.text[0] === '=') {
            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => expr2expr(word, n, 0, x => x >= sci));
          }
        }
        rndata[nci] = cell;
      });
      row.cells = rndata;
    });
  }

  deleteColumn(sci: number, eci: number): void {
    const n = eci - sci + 1;
    this.each((ri: number, row: Row) => {
      const rndata: { [key: number]: Cell } = {};
      this.eachCells(ri, (ci: number, cell: Cell) => {
        const nci = parseInt(ci.toString(), 10);
        if (nci < sci) {
          rndata[nci] = cell;
        } else if (nci > eci) {
          rndata[nci - n] = cell;
          if (cell.text && cell.text[0] === '=') {
            cell.text = cell.text.replace(/[a-zA-Z]{1,3}\d+/g, word => expr2expr(word, -n, 0, x => x > eci));
          }
        }
      });
      row.cells = rndata;
    });
  }

  deleteCells(cellRange: CellRange, what: 'all' | 'text' | 'format' | 'merge' = 'all'): void {
    cellRange.each((i: number, j: number) => {
      this.deleteCell(i, j, what);
    });
  }

  deleteCell(ri: number, ci: number, what: 'all' | 'text' | 'format' | 'merge' = 'all'): void {
    const row = this.get(ri);
    if (row) {
      const cell = this.getCell(ri, ci);
      if (cell !== null && cell.editable !== false) {
        if (what === 'all') {
          delete row.cells[ci];
        } else if (what === 'text') {
          if (cell.text) delete cell.text;
          if (cell.value) delete cell.value;
        } else if (what === 'format') {
          if (cell.style !== undefined) delete cell.style;
          if (cell.merge) delete cell.merge;
        } else if (what === 'merge') {
          if (cell.merge) delete cell.merge;
        }
      }
    }
  }

  maxCell(): [number, number] {
    const keys = Object.keys(this._);
    const ri = keys[keys.length - 1];
    const col = this._[parseInt(ri)];
    if (col) {
      const { cells } = col;
      const ks = Object.keys(cells);
      const ci = ks[ks.length - 1];
      return [parseInt(ri.toString(), 10), parseInt(ci.toString(), 10)];
    }
    return [0, 0];
  }

  each(cb: (ri: number, row: Row) => void): void {
    Object.entries(this._).forEach(([ri, row]) => {
      cb(parseInt(ri, 10), row);
    });
  }

  eachCells(ri: number, cb: (ci: number, cell: Cell) => void): void {
    if (this._[ri] && this._[ri].cells) {
      Object.entries(this._[ri].cells).forEach(([ci, cell]) => {
        cb(parseInt(ci, 10), cell);
      });
    }
  }

  setData(d: { len?: number;[key: number]: Row }): void {
    if (d.len) {
      this.len = d.len;
      delete d.len;
    }
    this._ = d;
  }

  getData(): { len: number;[key: number]: Row } {
    const { len } = this;
    return Object.assign({ len }, this._);
  }
}

export default {};
export {
  Rows,
};
