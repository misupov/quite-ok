import { ColumnsApi } from "./ColumnApi";
import { GridRow } from "./GridRow";
import { Rect } from "./types";
import { applyStyle, div } from "./ui";

type ViewportProps<T> = {
  lineHeight: number;
  columnApi: ColumnsApi<T>;
  rowData: Record<number, T>;
  coords: Rect;
};

export class Viewport<T> {
  root: HTMLDivElement;
  renderedRows: Map<number, GridRow<T>> = new Map();

  constructor(props: ViewportProps<T>) {
    this.root = div({ position: "absolute", transform: "translateZ(0)" });
    this.refresh(props);
  }

  refresh(props: ViewportProps<T>) {
    const visibleColumns = props.columnApi.getColumnsBetween(props.coords.x, props.coords.width);
    if (visibleColumns.length === 0) {
      applyStyle(this.root, { visibility: "collapse" });
    } else {
      const firstColumn = visibleColumns[0];
      const lastColumn = visibleColumns[visibleColumns.length - 1];
      const left = -props.coords.x;
      const width = lastColumn.offset + lastColumn.state.width - firstColumn.offset;

      const rowsToRemove = new Map<number, GridRow<T>>(this.renderedRows);

      const firstVisibleRow = Math.floor(props.coords.y / props.lineHeight);
      const lastVisibleRow = Math.floor((props.coords.y + props.coords.height) / props.lineHeight);

      const top = firstVisibleRow * props.lineHeight - props.coords.y;

      for (let i = firstVisibleRow; i <= lastVisibleRow; i++) {
        rowsToRemove.delete(i);
      }

      for (let i = firstVisibleRow; i <= lastVisibleRow; i++) {
        let row = this.renderedRows.get(i);
        const newProps = {
          columnApi: props.columnApi,
          index: i,
          firstCellIndex: firstColumn.index,
          lastCellIndex: lastColumn.index,
          item: props.rowData[i],
          top: (i - firstVisibleRow) * props.lineHeight,
          lineHeight: props.lineHeight,
        };
        if (!row) {
          const [idx, cachedRow] = rowsToRemove.entries().next().value ?? [];
          if (cachedRow) {
            row = cachedRow as GridRow<T>;
            rowsToRemove.delete(idx);
            this.renderedRows.delete(idx);
            this.renderedRows.set(i, row);
            row.refresh(newProps);
          } else {
            row = new GridRow<T>(newProps);
          }
          this.renderedRows.set(i, row);
          this.root.appendChild(row.root);
        } else {
          row.refresh(newProps);
        }
      }
      rowsToRemove.forEach((r, key) => {
        this.renderedRows.delete(key);
        this.root.removeChild(r.root);
      });

      // applyStyle(this.root, {
      //   visibility: "visible",
      //   left: `${left}px`,
      //   top: `${top}px`,
      //   width: `${width}px`,
      //   height: `${(lastVisibleRow - firstVisibleRow) * props.lineHeight}px`,
      // });
      this.root.style.visibility = "visible";
      // this.root.style.left = `${left}px`;
      // this.root.style.top = `${top}px`;
      this.root.style.transform = `translate(${left}px,${top}px) translateZ(0)`;
      this.root.style.width = `${width}px`;
      // this.root.style.height = `${(lastVisibleRow - firstVisibleRow) * props.lineHeight}px`;
    }
  }
}
