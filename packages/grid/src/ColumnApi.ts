import { ColumnDef, ColumnState } from "./types";

export class ColumnsApi<T> {
  private columnStates!: ColumnState[];
  private columnDefsMap!: Map<string, ColumnDef<T>>;
  private columnStatesMap!: Map<string, ColumnState>;
  private columnOffsets!: number[];
  totalWidth!: number;

  constructor(columnDefs: ColumnDef<T>[], columnStates: ColumnState[]) {
    this.updateColumnDefs(columnDefs);
    this.updateColumnStates(columnStates);
  }

  updateColumnDefs(columnDefs: ColumnDef<T>[]) {
    this.columnDefsMap = new Map();
    columnDefs.forEach((cd) => this.columnDefsMap.set(cd.id, cd));
  }

  updateColumnStates(columnStates: ColumnState[]) {
    this.columnStates = columnStates;
    let totalWidth = 0;
    this.columnStatesMap = new Map();
    this.columnOffsets = [];
    columnStates.forEach((cs) => {
      this.columnStatesMap.set(cs.id, cs);
      this.columnOffsets.push(totalWidth);
      totalWidth += cs.width;
    });
    this.totalWidth = totalWidth;
  }

  getColumnById(id: string) {
    return {
      def: this.columnDefsMap.get(id),
      state: this.columnStatesMap.get(id),
    };
  }

  getColumnByIndex(index: number) {
    const state = this.columnStates[index];
    return {
      def: this.columnDefsMap.get(state.id),
      state: this.columnStates[index],
      offset: this.columnOffsets[index],
    };
  }

  getColumnsBetween(from: number, width: number) {
    let x = 0;
    const result: { state: ColumnState; def: ColumnDef<T>; index: number; offset: number }[] = [];
    let index = 0;
    for (const state of this.columnStatesMap.values()) {
      if (typeof state.width === "number") {
        const def = this.columnDefsMap.get(state.id);
        if (def && x + state.width > from) {
          result.push({ state, def, index, offset: x });
        }
        x += state.width;
        if (x >= from + width) {
          break;
        }
      }
      index++;
    }
    return result;
  }
}
