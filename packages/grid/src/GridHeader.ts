import { ColumnHeader } from "./ColumnHeader";
import { ColumnsApi } from "./ColumnApi";
import { div } from "./ui";

export class GridHeader<T> {
  private renderedHeaders = new Map<string, ColumnHeader>();
  private columnsApi: ColumnsApi<T>;
  readonly root: HTMLDivElement;

  constructor(columnsApi: ColumnsApi<T>) {
    this.columnsApi = columnsApi;
    this.root = div({ position: "relative", height: "25px", transform: "translateZ(0)" });
  }

  refresh(viewportX: number, viewportWidth: number) {
    this.root.style.transform = `translate3d(${-viewportX}px,0,0)`;
    const visibleColumns = this.columnsApi.getColumnsBetween(viewportX, viewportWidth);
    const headersToHide = new Map(this.renderedHeaders);
    visibleColumns.forEach((c) => {
      let header = this.renderedHeaders.get(c.def.id);
      if (header) {
        headersToHide.delete(c.def.id);
      } else {
        header = new ColumnHeader();
        header.updateHeader(c.def.header ?? c.def.id);
        this.root.appendChild(header.root);
        this.renderedHeaders.set(c.def.id, header);
      }
      header.updateOffset(c.offset);
    });
    headersToHide.forEach((h, key) => {
      this.renderedHeaders.delete(key);
      this.root.removeChild(h.root);
    });
  }
}
