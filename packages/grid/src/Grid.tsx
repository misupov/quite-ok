import {
  ScrollPanel,
  ViewportChangeEventHandler,
} from "@quite-ok/scrollpanel-react";
import { useCallback, useLayoutEffect, useState } from "react";

export type CellRendererProps<TItem, TValue> = {
  item: TItem;
  value: TValue;
};

export type ColumnDef<TItem> = {
  id: string;
  field?: keyof TItem;
  renderer?: (props: CellRendererProps<TItem, keyof TItem>) => React.ReactNode;
};

export type GridApi<T> = {
  setRowData(rowData: Record<number, T>): void;
  setRowCount(count: number): void;
};

export interface GridDataSource<T> {
  init(gridApi: GridApi<T>): void;
  onViewportChange?(firstVisibleRow: number, lastVisibleRow: number): void;
}

export type GridProps<T> = {
  dataSource?: GridDataSource<T>;
  lineHeight?: number;
  columnDefs: ColumnDef<T>[];
};

export function Grid<T = unknown>({
  columnDefs,
  dataSource,
  lineHeight = 25,
}: GridProps<T>) {
  const [rowData, setRowData] = useState<Record<number, T>>({});
  const [rowCount, setRowCount] = useState(0);
  const [firstVisibleRow, setFirstVisibleRow] = useState(0);
  const [lastVisibleRow, setLastVisibleRow] = useState(0);

  const [gridApi] = useState<GridApi<T>>({
    setRowData,
    setRowCount,
  });

  useLayoutEffect(() => {
    if (dataSource) {
      dataSource.init(gridApi);
    }
  }, [dataSource, gridApi]);

  const [viewport, setViewport] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const onViewportChange: ViewportChangeEventHandler = useCallback(
    (e) => {
      setViewport(e);
      const firstRow = Math.floor(e.y / lineHeight);
      const lastRow = Math.floor((e.y + e.height) / lineHeight);
      setFirstVisibleRow(firstRow);
      setLastVisibleRow(lastRow);
      dataSource?.onViewportChange?.(firstRow, lastRow);
    },
    [dataSource, lineHeight]
  );

  const renderRow = useCallback(
    (key: number, left: number, top: number, item: T) => {
      if (item == null) {
        return null;
      }
      const startColumn = Math.floor(left / 200);
      const endColumn = Math.ceil((left + viewport.width) / 200);
      const visibleColumns = columnDefs.slice(startColumn, endColumn);
      return (
        <div
          key={key}
          style={{
            position: "absolute",
            top,
            left: -left,
          }}
        >
          {visibleColumns.map((cd, idx) => (
            <div
              key={cd.id}
              style={{
                position: "absolute",
                left: (idx + startColumn) * 200,
                width: 200,
                // border: "1px solid red",
              }}
            >
              {cd.renderer
                ? cd.renderer({
                    item,
                    value: item[cd.field!] as keyof T,
                  })
                : String(cd.field && item[cd.field]) ?? ""}
            </div>
          ))}
        </div>
      );
    },
    [columnDefs, viewport.width]
  );

  const [renderedRows, setRenderedRows] = useState<(React.ReactNode | null)[]>(
    []
  );

  useLayoutEffect(() => {
    const rows: (React.ReactNode | null)[] = [];
    for (let i = firstVisibleRow; i <= lastVisibleRow; i++) {
      const yOffs = i * lineHeight - viewport.y;
      rows.push(renderRow(i, viewport.x, yOffs, rowData[i]));
    }
    setRenderedRows(rows);
  }, [
    rowData,
    firstVisibleRow,
    lastVisibleRow,
    lineHeight,
    viewport,
    renderRow,
  ]);

  return (
    <ScrollPanel
      scrollWidth={columnDefs.length * 200}
      scrollHeight={rowCount * lineHeight}
      onViewportChange={onViewportChange}
    >
      <div style={{ position: "relative" }}>{...renderedRows}</div>
    </ScrollPanel>
  );
}
