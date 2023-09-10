import { ColumnDef, ColumnState } from ".";

export class ColumnsApi<T> {
  private columnDefsMap: Map<string, ColumnDef<T>>;

  private columnStatesMap: Map<string, ColumnState>;

  constructor(columnDefs: ColumnDef<T>[], columnStates: ColumnState[]) {
    this.columnDefsMap = new Map();
    columnDefs.forEach((cd) => this.columnDefsMap.set(cd.id, cd));
    this.columnStatesMap = new Map();
    columnStates.forEach((cs) => this.columnStatesMap.set(cs.id, cs));
  }

  getColumn(id: string) {
    return {
      def: this.columnDefsMap.get(id),
      state: this.columnStatesMap.get(id),
    };
  }

  getVisibleColumns(viewportX: number, viewportWidth: number) {
    let x = 0;
    const result: { state: ColumnState; def: ColumnDef<T>; offset: number }[] =
      [];
    for (const state of this.columnStatesMap.values()) {
      if (typeof state.width === "number") {
        const def = this.columnDefsMap.get(state.id);
        if (def && x + state.width > viewportX) {
          result.push({ state, def, offset: x });
        }
        x += state.width;
        if (x >= viewportX + viewportWidth) {
          break;
        }
      }
    }
    return result;
  }
}
