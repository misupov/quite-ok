import { CellRendererProps } from "@quite-ok/grid";
import { Item } from "../types";
import { COUNTRY_CODES } from "../consts";

export function CountryCellRenderer({
  value,
}: CellRendererProps<Item, string>) {
  return (
    <div>
      <img
        width={15}
        height={10}
        src={`https://flags.fmcdn.net/data/flags/mini/${COUNTRY_CODES[value]}.png`}
      />{" "}
      {value}
    </div>
  );
}
