import { CellRenderer, ColumnDef, ColumnState } from ".";
import { applyStyle, div } from "./ui";

type GridCellProps<T> = { columnDef?: ColumnDef<T>; state: ColumnState; x: number; item: T };

export class GridCell<T> {
  root: HTMLDivElement;
  renderer?: CellRenderer<T>;
  innerText?: string;

  constructor(props: GridCellProps<T>) {
    this.root = div({ position: "absolute" });
    this.refresh(props);
  }

  refresh(props: GridCellProps<T>) {
    // applyStyle(this.root, { left: `${props.x}px` });
    this.root.style.transform = `translateX(${props.x}px)`;
    if (props.columnDef?.field) {
      const rendererCtor = props.columnDef?.renderer;
      if (rendererCtor) {
        this.renderer = this.renderer ?? rendererCtor();
        this.renderer.render(this.root, { item: props.item, value: props.item[props.columnDef.field] });
      } else {
        const text = String(props.item[props.columnDef.field]);
        if (text !== this.innerText) {
          this.innerText = text;
          this.root.innerText = text;
        }
      }
    }
  }
}
