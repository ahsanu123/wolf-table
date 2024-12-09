import { CellRange } from './cell-range';

export default class Selector {
  private range: CellRange;
  private ri: number;
  private ci: number;

  constructor() {
    this.range = new CellRange(0, 0, 0, 0);
    this.ri = 0;
    this.ci = 0;
  }

  public multiple(): boolean {
    return this.range.multiple();
  }

  public setIndexes(ri: number, ci: number): void {
    this.ri = ri;
    this.ci = ci;
  }

  public size() {
    return this.range.size();
  }
}
