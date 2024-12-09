import CellRange from "./cell-range";

export default class Clipboard {
  private range: CellRange | null;
  private state: 'clear' | 'copy' | 'cut';

  constructor() {
    this.range = null;
    this.state = 'clear';
  }

  public copy(cellRange: CellRange): Clipboard {
    this.range = cellRange;
    this.state = 'copy';
    return this;
  }

  public cut(cellRange: CellRange): Clipboard {
    this.range = cellRange;
    this.state = 'cut';
    return this;
  }

  public isCopy(): boolean {
    return this.state === 'copy';
  }

  public isCut(): boolean {
    return this.state === 'cut';
  }

  public isClear(): boolean {
    return this.state === 'clear';
  }

  public clear(): void {
    this.range = null;
    this.state = 'clear';
  }
}
