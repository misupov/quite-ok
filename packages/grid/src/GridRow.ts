import { ColumnsApi as ColumnApi } from "./ColumnApi";
import { GridCell } from "./GridCell";
import { Rect } from "./types";
import { applyStyle, div } from "./ui";

type GridRowProps<T> = {
  columnApi: ColumnApi<T>;
  index: number;
  top: number;
  firstCellIndex: number;
  lastCellIndex: number;
  item: T | undefined;
  lineHeight: number;
};

export class GridRow<T> {
  root: HTMLDivElement;
  renderedCells: Map<string, GridCell<T>> = new Map();
  prevProps?: GridRowProps<T>;

  constructor(props: GridRowProps<T>) {
    this.root = div({ position: "absolute", transform: "translateZ(0)" });
    this.refresh(props);
  }

  refresh(props: GridRowProps<T>) {
    try {
      if (props.item == null) {
        return null;
      }

      // applyStyle(this.root, { left: "0", right: "0", top: `${props.top}px`, height: `${props.lineHeight}px` });
      this.root.style.left = "0";
      this.root.style.right = "0";
      // this.root.style.top = `${props.top}px`;
      this.root.style.transform = `translateY(${props.top}px) translateZ(0)`;
      this.root.style.height = `${props.lineHeight}px`;

      if (
        this.prevProps &&
        this.prevProps.item === props.item &&
        this.prevProps.index === props.index &&
        this.prevProps.firstCellIndex === props.firstCellIndex &&
        this.prevProps.lastCellIndex === props.lastCellIndex
      ) {
        return;
      }

      let x = 0;
      let cellsToRemove = new Map(this.renderedCells);
      for (let i = props.firstCellIndex; i <= props.lastCellIndex; i++) {
        const col = props.columnApi.getColumnByIndex(i);
        let cell = this.renderedCells.get(col.state.id);
        cellsToRemove.delete(col.state.id);
        const newProps = { columnDef: col.def, state: col.state, x: col.offset, item: props.item };
        if (!cell) {
          cell = new GridCell<T>(newProps);
          this.root.appendChild(cell.root);
          this.renderedCells.set(col.state.id, cell);
        } else {
          cell.refresh(newProps);
        }

        x += col.state.width;
      }
      cellsToRemove.forEach((cell, key) => {
        this.renderedCells.delete(key);
        this.root.removeChild(cell.root);
      });
    } finally {
      this.prevProps = props;
    }
  }
}
