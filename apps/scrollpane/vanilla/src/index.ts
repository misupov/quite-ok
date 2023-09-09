import { ScrollPanel } from "../../../../packages/scrollpanel/dist";

const root = document.createElement("div");
document.body.appendChild(root);

const scrollbar = new ScrollPanel(root, root);
console.error(scrollbar);
