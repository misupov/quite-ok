import { Item } from "../types";
import { COUNTRY_CODES } from "../consts";
import { CellRendererProps } from "@quite-ok/grid-react";

function simulateSlowRendering() {
  // const now = performance.now();
  // while (performance.now() - now < 5);
}

export function CountryCellRenderer({
  value,
}: CellRendererProps<Item, string>) {
  simulateSlowRendering();

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
