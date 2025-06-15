import { markdownToHtml } from "./markdown-to-html";
import { htmlToMarkdown } from "./html-to-markdown";

const markdown = `# Hello World
This is a **markdown** document with *italic* text and [a link](https://example.com).`;

const html = markdownToHtml(markdown);
console.log("Converted Markdown to HTML:");
console.log(html);

export { markdownToHtml } from "./markdown-to-html";
export { htmlToMarkdown } from "./html-to-markdown";
