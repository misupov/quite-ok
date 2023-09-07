import { ScrollPane } from "@quite-ok/scrollbar";

const root = document.createElement("div");
document.body.appendChild(root);

const scrollbar = new ScrollPane(root, root);
console.error(scrollbar);
