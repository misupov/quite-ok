import { div } from "./ui";

export class ColumnHeader {
  root: HTMLDivElement;

  constructor() {
    this.root = div({ position: "absolute" });
  }

  updateHeader(header: string) {
    this.root.innerText = header;
  }

  updateOffset(offset: number) {
    this.root.style.left = `${offset}px`;
  }
}
