import { ColumnsApi as ColumnApi } from "./ColumnApi";
import { GridCell } from "./GridCell";
import { div } from "./ui";

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
    this.root = div({ position: "absolute", width: "100%", transform: "translate3d(0,0,0)" });
    this.refresh(props);
  }

  refresh(props: GridRowProps<T>) {
    try {
      if (props.item == null) {
        return null;
      }

      const firstCol = props.columnApi.getColumnByIndex(props.firstCellIndex);

      // this.root.style.inset = "0";
      this.root.style.transform = `translate3d(${firstCol.offset}px,${props.top}px,0)`;
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
        const newProps = {
          columnDef: col.def,
          state: col.state,
          x: col.offset - firstCol.offset,
          width: col.state.width,
          item: props.item,
        };
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
