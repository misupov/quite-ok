export type Rect = { x: number; y: number; width: number; height: number };

export type CellRendererProps<TItem, TValue> = {
  item: TItem;
  value: TValue;
};

export type CellRenderer<TItem, TValue = unknown> = {
  render(container: HTMLElement, props: CellRendererProps<TItem, TValue>): void;
};

export type ColumnDef<TItem> = {
  id: string;
  field?: keyof TItem;
  header?: string;
  renderer?: () => CellRenderer<TItem, unknown>;
};

export type ColumnState = {
  id: string;
  width: number;
  pinned?: "left" | "right";
  sort?: "asc" | "desc";
};

export type GridApi<T> = {
  setRowData(rowData: Record<number, T>): void;
  setRowCount(count: number): void;
};

export interface GridDataSource<T> {
  init(gridApi: GridApi<T>): void;
  onViewportChange?(firstVisibleRow: number, lastVisibleRow: number): void;
}
