import { ScrollPanel, ViewportChangeEvent } from "@quite-ok/scrollpanel";
import { ColumnsApi } from "./ColumnApi";
import { GridHeader } from "./GridHeader";
import { deferred } from "./deferred";
import { ColumnDef, ColumnState, GridDataSource, Rect } from "./types";
import { Viewport } from "./Viewport";
import { applyStyle, div } from "./ui";

export type GridOptions<T> = {
  dataSource?: GridDataSource<T>;
  lineHeight?: number;
  columnDefs: ColumnDef<T>[];
  columnStates: ColumnState[];
};

export class Grid<T = unknown> {
  container: HTMLElement;
  columnApi: ColumnsApi<T>;
  gridHeader: GridHeader<T>;
  gridViewport: Viewport<T>;
  scrollPanel: ScrollPanel;
  dataSource: GridDataSource<T> | undefined;
  rowData: Record<number, T> = {};
  rowCount: number = 0;
  scrollArea: HTMLDivElement;
  viewport: Rect = { x: 0, y: 0, width: 0, height: 0 };
  firstVisibleRow = 0;
  lastVisibleRow = 0;
  lineHeight: number = 25;

  constructor(container: HTMLElement, options: GridOptions<T>) {
    this.dataSource = options.dataSource;
    applyStyle(container, { display: "grid", gridTemplateRows: "auto 1fr" });
    this.columnApi = new ColumnsApi(options.columnDefs, options.columnStates);
    this.gridHeader = new GridHeader(this.columnApi);
    this.lineHeight = options.lineHeight ?? 25;
    this.gridViewport = new Viewport<T>({ columnApi: this.columnApi, coords: this.viewport, lineHeight: this.lineHeight, rowData: this.rowData });
    this.scrollArea = div({ position: "relative", overflow: "hidden" });
    this.scrollArea.appendChild(this.gridViewport.root);
    this.scrollPanel = new ScrollPanel(this.scrollArea, this.scrollArea);
    this.scrollPanel.on("viewportchange", this.onViewportChange);
    container.appendChild(this.gridHeader.root);
    container.appendChild(this.scrollArea);
    this.container = container;
    this.initDataSource();
    this.refresh();
  }

  destroy() {
    this.container.removeChild(this.gridHeader.root);
    this.container.removeChild(this.scrollArea);
    this.scrollPanel.destroy();
  }

  setOptions(options: GridOptions<T>) {
    this.columnApi.updateColumnDefs(options.columnDefs);
    this.columnApi.updateColumnStates(options.columnStates);
    this.lineHeight = options.lineHeight ?? 25;
    if (this.dataSource !== options.dataSource) {
      this.dataSource = options.dataSource;
      this.initDataSource();
    }
    this.refresh();
  }

  private initDataSource() {
    this.dataSource?.init({
      setRowData: this.setRowData,
      setRowCount: this.setRowCount,
    });
  }

  private setRowData = (rowData: Record<number, T>) => {
    this.rowData = rowData;
    this.refresh();
  };

  private setRowCount = (rowCount: number) => {
    this.rowCount = rowCount;
    this.refresh();
  };

  private updateDom = () => {
    this.scrollPanel.setScrollArea(this.columnApi.totalWidth, this.rowCount * this.lineHeight);
    this.gridViewport.refresh({ columnApi: this.columnApi, coords: this.viewport, lineHeight: this.lineHeight, rowData: this.rowData });
    this.gridHeader.refresh(this.viewport.x, this.viewport.width);
  };

  private updateDomDeferred = deferred(this.updateDom);

  private refresh = () => {
    this.updateDomDeferred();
  };

  private onViewportChange = (e: ViewportChangeEvent) => {
    this.viewport = e;
    const firstVisibleRow = Math.floor(e.y / this.lineHeight);
    const lastVisibleRow = Math.floor((e.y + e.height) / this.lineHeight);
    if (this.firstVisibleRow !== firstVisibleRow || this.lastVisibleRow !== lastVisibleRow) {
      this.firstVisibleRow = firstVisibleRow;
      this.lastVisibleRow = lastVisibleRow;
      this.dataSource?.onViewportChange?.(firstVisibleRow, lastVisibleRow);
    }
    this.refresh();
  };

  // const [rowData, setRowData] = useState<Record<number, T>>({});
  // const [rowCount, setRowCount] = useState(0);
  // const [firstVisibleRow, setFirstVisibleRow] = useState(0);
  // const [lastVisibleRow, setLastVisibleRow] = useState(0);

  // const columnsApi = useMemo(
  //   () => new ColumnsApi(columnDefs, columnStates),
  //   [columnDefs, columnStates]
  // );

  // const [gridApi] = useState<GridApi<T>>({
  //   setRowData,
  //   setRowCount,
  // });

  // useLayoutEffect(() => {
  //   if (dataSource) {
  //     dataSource.init(gridApi);
  //   }
  // }, [dataSource, gridApi]);

  // const [viewport, setViewport] = useState({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  // });

  // const onViewportChange: ViewportChangeEventHandler = useCallback(
  //   (e) => {
  //     setViewport(e);
  //     const firstRow = Math.floor(e.y / lineHeight);
  //     const lastRow = Math.floor((e.y + e.height) / lineHeight);
  //     setFirstVisibleRow(firstRow);
  //     setLastVisibleRow(lastRow);
  //     dataSource?.onViewportChange?.(firstRow, lastRow);
  //   },
  //   [dataSource, lineHeight]
  // );

  // const renderRow = useCallback(
  //   (index: number, left: number, top: number, item: T) => {
  //     if (item == null) {
  //       return null;
  //     }
  //     // const startColumn = Math.floor(left / 200);
  //     // const endColumn = Math.ceil((left + viewport.width) / 200);
  //     // const visibleColumns = columnDefs.slice(startColumn, endColumn);
  //     const visibleColumns = columnsApi.getVisibleColumns(
  //       viewport.x,
  //       viewport.width
  //     );
  //     return (
  //       <div
  //         key={index}
  //         style={{
  //           position: "absolute",
  //           top,
  //           left: -left,
  //         }}
  //       >
  //         {visibleColumns.map((cd) => (
  //           <div
  //             key={cd.state.id}
  //             style={{
  //               position: "absolute",
  //               left: cd.offset,
  //               width: cd.state.width,
  //               height: lineHeight,
  //               borderRight: "1px solid lightgray",
  //               borderBottom: "1px solid lightgray",
  //               background: index % 2 ? "#f7f7f7" : "#fff",
  //               boxSizing: "border-box",
  //             }}
  //           >
  //             {cd.def.renderer
  //               ? cd.def.renderer({
  //                   item,
  //                   value: item[cd.def.field!] as keyof T,
  //                 })
  //               : String(cd.def.field && item[cd.def.field]) ?? ""}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   },
  //   [columnsApi, lineHeight, viewport.width, viewport.x]
  // );

  // const [renderedRows, setRenderedRows] = useState<(React.ReactNode | null)[]>(
  //   []
  // );

  // useLayoutEffect(() => {
  //   const rows: (React.ReactNode | null)[] = [];
  //   for (let i = firstVisibleRow; i <= lastVisibleRow; i++) {
  //     const yOffs = i * lineHeight - viewport.y;
  //     rows.push(renderRow(i, viewport.x, yOffs, rowData[i]));
  //   }
  //   setRenderedRows(rows);
  // }, [
  //   rowData,
  //   firstVisibleRow,
  //   lastVisibleRow,
  //   lineHeight,
  //   viewport,
  //   renderRow,
  // ]);

  // return (
  //   <div
  //     style={{
  //       display: "grid",
  //       gridTemplateRows: "auto 1fr",
  //       overflow: "hidden",
  //     }}
  //   >
  //     <GridHeader<T>
  //       columnsApi={columnsApi}
  //       viewportX={viewport.x}
  //       viewportWidth={viewport.width}
  //     />
  //     <ScrollPanel
  //       scrollWidth={columnsApi.totalWidth}
  //       scrollHeight={rowCount * lineHeight}
  //       onViewportChange={onViewportChange}
  //     >
  //       <div style={{ position: "relative" }}>{...renderedRows}</div>
  //     </ScrollPanel>
  //   </div>
  // );
}
