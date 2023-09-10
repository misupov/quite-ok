/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Grid as VanillaGrid,
  ColumnDef as VanillaColumnDef,
} from "@quite-ok/grid";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { createWrapper } from "./RendererWrapper";

export type CellRendererProps<TItem, TValue> = {
  item: TItem;
  value: TValue;
};

export type ColumnDef<TItem> = {
  id: string;
  field?: keyof TItem;
  header?: string;
  renderer?: (props: CellRendererProps<TItem, keyof TItem>) => React.ReactNode;
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

export type GridProps<T> = {
  dataSource?: GridDataSource<T>;
  lineHeight?: number;
  columnDefs: ColumnDef<T>[];
  columnStates: ColumnState[];
};

function wrapReactRenderer<TItem>(
  renderer: (props: CellRendererProps<TItem, keyof TItem>) => React.ReactNode
) {
  return createWrapper(renderer);
}

function translateColumnDefs<T>(
  columnDefs: ColumnDef<T>[]
): VanillaColumnDef<T>[] {
  return columnDefs.map((cd) => ({
    ...cd,
    renderer: cd.renderer && wrapReactRenderer<T>(cd.renderer),
  }));
}

export function Grid<T = unknown>(props: GridProps<T>) {
  const [initialProps] = useState(props);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<VanillaGrid<T>>();
  useLayoutEffect(() => {
    if (containerRef.current) {
      const grid = new VanillaGrid(containerRef.current, {
        columnDefs: translateColumnDefs(initialProps.columnDefs),
        columnStates: initialProps.columnStates,
        dataSource: initialProps.dataSource,
        lineHeight: initialProps.lineHeight,
      });
      return () => {
        grid.destroy();
      };
    }
  }, [initialProps]);

  useEffect(() => {
    gridRef.current?.setOptions({
      columnDefs: translateColumnDefs<T>(props.columnDefs),
      columnStates: props.columnStates,
      dataSource: props.dataSource,
      lineHeight: props.lineHeight,
    });
  }, [props]);

  return <div ref={containerRef} />;
}
