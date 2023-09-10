/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  CellRenderer,
  CellRendererProps,
} from "@quite-ok/grid/dist/CellRenderer";
import { Root, createRoot } from "react-dom/client";

type RRenderer<TItem> = (
  props: CellRendererProps<TItem, keyof TItem>
) => React.ReactNode;

class ReactRenderer<TItem> implements CellRenderer<TItem> {
  root?: Root;

  constructor(private innerRenderer: RRenderer<TItem>) {}

  render(container: HTMLElement, props: CellRendererProps<TItem, unknown>) {
    if (!this.root) {
      this.root = createRoot(container);
    }
    this.root.render(this.innerRenderer(props as any));
  }
}
export function createWrapper<TItem>(
  renderer: (props: CellRendererProps<TItem, keyof TItem>) => React.ReactNode
) {
  return () => new ReactRenderer(renderer);
}
