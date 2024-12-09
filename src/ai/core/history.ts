export default class History {
  private undoItems: string[];
  private redoItems: string[];

  constructor() {
    this.undoItems = [];
    this.redoItems = [];
  }

  add(data: any): void {
    this.undoItems.push(JSON.stringify(data));
    this.redoItems = [];
  }

  canUndo(): boolean {
    return this.undoItems.length > 0;
  }

  canRedo(): boolean {
    return this.redoItems.length > 0;
  }

  undo(currentd: any, cb: (data: any) => void): void {
    const { undoItems, redoItems } = this;
    if (this.canUndo()) {
      redoItems.push(JSON.stringify(currentd));
      cb(JSON.parse(undoItems.pop() as string));
    }
  }

  redo(currentd: any, cb: (data: any) => void): void {
    const { undoItems, redoItems } = this;
    if (this.canRedo()) {
      undoItems.push(JSON.stringify(currentd));
      cb(JSON.parse(redoItems.pop() as string));
    }
  }
}
