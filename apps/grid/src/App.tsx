import { useEffect, useState } from "react";
import "./App.css";
import {
  ColumnDef,
  ColumnState,
  Grid,
  GridApi,
  GridDataSource,
} from "@quite-ok/grid";
import { Item } from "./types";
import { countries, firstNames, lastNames } from "./consts";
import { CountryCellRenderer } from "./cell-renderers/Country";

const columnDefs: ColumnDef<Item>[] = [
  { id: "name", field: "name", header: "Name" },
  {
    id: "country",
    field: "country",
    header: "Country",
    renderer: CountryCellRenderer,
  },
  { id: "continent", field: "continent", header: "Continent" },
  { id: "language", field: "language", header: "Language" },
  { id: "jan", field: "jan", header: "Jan" },
  { id: "feb", field: "feb", header: "Feb" },
  { id: "mar", field: "mar", header: "Mar" },
  { id: "apr", field: "apr", header: "Apr" },
  { id: "may", field: "may", header: "May" },
  { id: "jun", field: "jun", header: "Jun" },
  { id: "jul", field: "jul", header: "Jul" },
  { id: "aug", field: "aug", header: "Aug" },
  { id: "sep", field: "sep", header: "Sep" },
  { id: "oct", field: "oct", header: "Oct" },
  { id: "nov", field: "nov", header: "Nov" },
  { id: "dec", field: "dec", header: "Dec" },
];

const columnStates = [
  { id: "name", width: 200 },
  { id: "country", width: 200 },
  { id: "continent", width: 200 },
  { id: "language", width: 200 },
  { id: "jan", width: 100 },
  { id: "feb", width: 100 },
  { id: "mar", width: 100 },
  { id: "apr", width: 100 },
  { id: "may", width: 100 },
  { id: "jun", width: 100 },
  { id: "jul", width: 100 },
  { id: "aug", width: 100 },
  { id: "sep", width: 100 },
  { id: "oct", width: 100 },
  { id: "nov", width: 100 },
  { id: "dec", width: 100 },
] satisfies ColumnState[];

class DataSource implements GridDataSource<Item> {
  private timer?: number;
  gridApi!: GridApi<Item>;

  init(gridApi: GridApi<Item>): void {
    this.gridApi = gridApi;
    this.gridApi.setRowCount(10000);
  }
  destroy() {
    clearInterval(this.timer);
  }
  onViewportChange(firstVisibleRow: number, lastVisibleRow: number): void {
    const data: Record<number, Item> = {};
    for (let i = firstVisibleRow; i <= lastVisibleRow; i++) {
      data[i] = {
        name:
          firstNames[i % firstNames.length] +
          " " +
          lastNames[i % lastNames.length],
        country: countries[i % countries.length].country,
        continent: countries[i % countries.length].continent,
        language: countries[i % countries.length].language,
        jan: i,
        feb: i * 2,
        mar: i * 3,
        apr: i * 4,
        may: i * 5,
        jun: i * 6,
        jul: i * 7,
        aug: i * 8,
        sep: i * 9,
        oct: i * 10,
        nov: i * 11,
        dec: i * 12,
      };
    }
    this.gridApi.setRowData(data);
  }
}

function App() {
  const [dataSource] = useState<DataSource>(() => new DataSource());

  useEffect(() => {
    return () => {
      dataSource.destroy();
    };
  }, [dataSource]);

  return (
    <>
      <div
        style={{
          width: "1000px",
          height: 600,
          display: "grid",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Grid<Item>
          dataSource={dataSource}
          // lineHeight={40}
          columnDefs={columnDefs}
          columnStates={columnStates}
        />
      </div>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
