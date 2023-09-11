import { div } from "./ui";

export class ColumnHeader {
  root: HTMLDivElement;
  header?: string;

  constructor() {
    this.root = div({ position: "absolute" });
  }

  updateHeader(header: string) {
    if (this.header !== header) {
      this.header = header;
      this.root.innerText = header;
    }
  }

  updateOffset(offset: number) {
    this.root.style.transform = `translateX(${offset}px)`;
  }
}
