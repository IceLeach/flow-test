import { ComponentNodeType } from "../types";

type StoreValueType = ComponentNodeType[];

/** 存储历史记录 */
export class Store {
  history: StoreValueType[] = [];

  current: number = -1;

  constructor(value?: ComponentNodeType[]) {
    if (value) {
      this.history = [value];
      this.current = 0;
    }
  }

  hasCurrent(): boolean {
    return this.current > -1;
  }

  getValue(): StoreValueType | undefined {
    return this.hasCurrent() ? this.history[this.current] : undefined;
  }

  setValue(value: ComponentNodeType[]) {
    const newHistory = this.hasCurrent() ? this.history.slice(0, this.current + 1) : [];
    newHistory.push(value);
    this.history = newHistory;
    this.current += 1;
  }

  reset(value: ComponentNodeType[]) {
    this.history = [value];
    this.current = 0;
  }

  clear() {
    this.history = [];
    this.current = -1;
  }

  getUndoLength(): number {
    if (!this.hasCurrent()) return 0;
    return this.current;
  }

  getRedoLength(): number {
    if (!this.hasCurrent()) return 0;
    return this.history.length - this.current - 1;
  }

  canUndo(): boolean {
    return this.getUndoLength() > 0;
  }

  canRedo(): boolean {
    return this.getRedoLength() > 0;
  }

  undo() {
    if (this.canUndo()) {
      this.current -= 1;
    }
  }

  redo() {
    if (this.canRedo()) {
      this.current += 1;
    }
  }
}
