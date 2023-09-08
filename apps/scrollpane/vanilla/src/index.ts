import { ScrollPanel } from "@quite-ok/scrollpanel";

const root = document.createElement("div");
document.body.appendChild(root);

const scrollbar = new ScrollPanel(root, root);
console.error(scrollbar);
