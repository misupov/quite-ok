import { CellRendererProps } from "@quite-ok/grid";
import { Item } from "../types";

export function CountryCellRenderer({
  value,
}: CellRendererProps<Item, string>) {
  return <div>{value}</div>;
}
