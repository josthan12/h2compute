import { loadContent } from "../lib/content";
const items = loadContent();
console.log(
  `Validated ${items.length} content files: metadata, verified outcome references, quiz explanations, publication links and anchors.`,
);
