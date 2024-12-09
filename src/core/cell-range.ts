import { expr2xy } from "./alphabet"

export class CellRange {
  sri: number
  sci: number
  eri: number
  eci: number

  width: number
  height: number

  constructor(
    sri: number,
    sci: number,
    eri: number,
    eci: number,
    w: number = 0,
    h: number = 0
  ) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
    this.width = w;
    this.height = h;

  }

  set(sri: number, sci: number, eri: number, eci: number) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
  }

  multiple() {
    return this.eri - this.sri > 0 || this.eci - this.sci > 0;
  }

  includes(...args: string[]) {
    let [ri, ci] = [0, 0];
    if (args.length === 1) {
      [ci, ri] = expr2xy(args[0]);
    } else if (args.length === 2) {
      [ri, ci] = [parseInt(args[0]), parseInt(args[1])];
    }
    const {
      sri, sci, eri, eci,
    } = this;
    return sri <= ri && ri <= eri && sci <= ci && ci <= eci;
  }

}
