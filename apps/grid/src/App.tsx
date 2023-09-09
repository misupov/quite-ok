import { useEffect, useState } from "react";
import "./App.css";
import { ColumnDef, Grid, GridApi, GridDataSource } from "@quite-ok/grid";
import { Item } from "./types";
import { countries, firstNames, lastNames } from "./consts";
import { CountryCellRenderer } from "./cell-renderers/Country";

const columnDefs: ColumnDef<Item>[] = [
  { id: "name", field: "name" },
  {
    id: "country",
    field: "country",
    renderer: CountryCellRenderer,
  },
  { id: "continent", field: "continent" },
  { id: "language", field: "language" },
  { id: "jan", field: "jan" },
  { id: "feb", field: "feb" },
  { id: "mar", field: "mar" },
  { id: "apr", field: "apr" },
  { id: "may", field: "may" },
  { id: "jun", field: "jun" },
  { id: "jul", field: "jul" },
  { id: "aug", field: "aug" },
  { id: "sep", field: "sep" },
  { id: "oct", field: "oct" },
  { id: "nov", field: "nov" },
  { id: "dec", field: "dec" },
];

class DataSource implements GridDataSource<Item> {
  private timer?: number;
  gridApi!: GridApi<Item>;

  init(gridApi: GridApi<Item>): void {
    this.gridApi = gridApi;
    this.gridApi.setRowCount(100000);
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
  const [dataSource, setDataSource] = useState<DataSource>();

  useEffect(() => {
    const ds = new DataSource();
    setDataSource(ds);
    return () => {
      ds.destroy();
    };
  }, []);

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
          lineHeight={40}
          columnDefs={columnDefs}
        />
      </div>
      <h1>Vite + React</h1>
    </>
  );
}

export default App;
