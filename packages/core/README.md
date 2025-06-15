# MarkdownNinja

![npm version](https://img.shields.io/npm/v/markdownninja?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/markdownninja?style=flat-square)
![License](https://img.shields.io/npm/l/markdownninja?style=flat-square)

A powerful and lightweight **zero-dependency** (for Node.js environment) library for seamless conversion between HTML and Markdown. `markdownninja` offers robust features for both directions, handling a wide range of formatting, from headings and lists to tables and code blocks, with an emphasis on preserving content and structure.

## ✨ Features

-   **HTML to Markdown:** Convert various HTML structures (headings, paragraphs, lists, tables, images, links, code, blockquotes, checkboxes, etc.) into their Markdown equivalents.
-   **Markdown to HTML:** Transform Markdown text (including headings, lists, tables, code blocks, emphasis, links, images, task lists, and blockquotes) into semantic HTML.
-   **Lightweight:** Designed to be efficient with minimal overhead.
-   **Zero Dependencies (Node.js):** For HTML to Markdown conversion, it uses `linkedom` as a peer dependency for DOM parsing, ensuring a small footprint. Markdown to HTML has no external dependencies.
-   **Smart Formatting:** Attempts to produce clean and readable Markdown/HTML.
-   **Inline HTML/Markdown Support:** Option to allow or escape raw HTML in Markdown-to-HTML and raw HTML in HTML-to-Markdown.
-   **Task List Support:** Converts `[ ]` and `[x]` checkboxes between formats.

## 🚀 Installation

You can install `markdownninja` using npm or yarn:

```bash
npm install markdownninja
# or
yarn add markdownninja
```

<!-- **Note on `linkedom`:** `markdownninja` uses `linkedom` as a peer dependency for its HTML-to-Markdown conversion. `linkedom` is a very fast and lightweight DOM parser. Make sure to install it alongside `markdownninja`. -->

## 💡 Usage

### HTML to Markdown Conversion

Use the `htmlToMarkdown` function to convert an HTML string into a Markdown string.

```typescript
import { htmlToMarkdown } from "markdownninja";

const htmlInput = `
  <h1>Welcome to Markdown Ninja</h1>
  <p>This is a <strong>paragraph</strong> with <em>some</em> text.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2 with an <a href="https://example.com">example link</a></li>
    <li><input type="checkbox" checked> Task done</li>
    <li><input type="checkbox"> Task pending</li>
  </ul>
  <pre><code>console.log('Hello, Markdown!');</code></pre>
  <table>
    <thead>
      <tr><th>Header 1</th><th>Header 2</th></tr>
    </thead>
    <tbody>
      <tr><td>Data A</td><td>Data B</td></tr>
      <tr><td>Data C</td><td>Data D</td></tr>
    </tbody>
  </table>
  <blockquote>This is a blockquote.</blockquote>
  <p>An image: <img src="image.jpg" alt="A beautiful image"></p>
`;

const markdownOutput = htmlToMarkdown(htmlInput);
console.log(markdownOutput);
/*
# Welcome to Markdown Ninja

This is a **paragraph** with *some* text.

- Item 1
- Item 2 with an [example link](https://example.com)
- [x] Task done
- [ ] Task pending


console.log('Hello, Markdown!');


| Header 1 | Header 2 |
| -------- | -------- |
| Data A   | Data B   |
| Data C   | Data D   |

> This is a blockquote.

An image: ![A beautiful image](image.jpg)
\*/

// Option: allowHtml (default: false) - If true, unknown HTML tags are kept as-is.
const htmlWithUnknownTag = `<p>Hello <unknown-tag>world</unknown-tag>!</p>`;
const markdownWithHtml = htmlToMarkdown(htmlWithUnknownTag, { allowHtml: true });
console.log(markdownWithHtml);
// Output: Hello <unknown-tag>world</unknown-tag>!
```

### Markdown to HTML Conversion

Use the `markdownToHtml` function to convert a Markdown string into an HTML string.

```typescript
import { markdownToHtml } from "markdownninja";

const markdownInput = `
# My Awesome Document

This is a paragraph with **bold** and *italic* text. Also, a ~~strikethrough~~.

## Lists
*   Unordered item 1
*   Unordered item 2
    *   Nested item
1.  Ordered item 1
2.  Ordered item 2
    1.  Nested ordered item

### Task List
- [x] Completed task
- [ ] Pending task

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote.

| Header A | Header B |
|----------|----------|
| Value 1  | Value 2  |
| Value 3  | Value 4  |

A link: [Google](https://google.com)
An image: ![Alt Text](https://example.com/image.png)

---

Another paragraph.
`;

const htmlOutput = markdownToHtml(markdownInput);
console.log(htmlOutput);
/*
<h1 id="my-awesome-document">My Awesome Document</h1>
<p>This is a paragraph with <strong>bold</strong> and <em>italic</em> text. Also, a <del>strikethrough</del>.</p>
<h2 id="lists">Lists</h2>
<ul>
    <li>Unordered item 1</li>
    <li>
        Unordered item 2
        <ul>
            <li>Nested item</li>
        </ul>
    </li>
</ul>
<ol>
    <li>Ordered item 1</li>
    <li>
        Ordered item 2
        <ol>
            <li>Nested ordered item</li>
        </ol>
    </li>
</ol>
<h3 id="task-list">Task List</h3>
<ul>
    <li><input type="checkbox" disabled checked /> Completed task</li>
    <li><input type="checkbox" disabled /> Pending task</li>
</ul>
<pre><code>function greet(name) {
  return `Hello, ${name}!`;
}</code></pre>
<blockquote>This is a blockquote.</blockquote>
<table>
    <thead>
        <tr>
            <th>Header A</th>
            <th>Header B</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Value 1</td>
            <td>Value 2</td>
        </tr>
        <tr>
            <td>Value 3</td>
            <td>Value 4</td>
        </tr>
    </tbody>
</table>
<p>
    A link: <a href="https://google.com">Google</a> An image: <img alt="Alt Text" src="https://example.com/image.png" />
</p>
<hr />
<p>Another paragraph.</p>

*/

// Option: allowHtml (default: true) - If false, raw HTML in markdown will be escaped.
const markdownWithHtmlInput = `This is <b>bold</b> HTML.`;
const htmlWithEscapedHtml = markdownToHtml(markdownWithHtmlInput, { allowHtml: false });
console.log(htmlWithEscapedHtml);
// Output: <p>This is &lt;b&gt;bold&lt;/b&gt; HTML.</p>

const htmlWithAllowedHtml = markdownToHtml(markdownWithHtmlInput, { allowHtml: true });
console.log(htmlWithAllowedHtml);
// Output: <p>This is <b>bold</b> HTML.</p>
```

## 🛠️ API

### `htmlToMarkdown(html: string, options?: { allowHtml?: boolean }): string`

Converts an HTML string into a Markdown string.

-   `html` (string): The HTML content to convert.
-   `options` (object, optional):
    -   `allowHtml` (boolean, default: `false`): If `true`, unknown or unhandled HTML tags will be preserved as raw HTML in the output Markdown. If `false`, their content will be extracted, but the tags themselves will be dropped (e.g., `<div class="container">Content</div>` might become just `Content`).

### `markdownToHtml(markdown: string, options?: { allowHtml?: boolean }): string`

Converts a Markdown string into an HTML string.

-   `markdown` (string): The Markdown content to convert.
-   `options` (object, optional):
    -   `allowHtml` (boolean, default: `true`): If `true`, raw HTML tags present in the Markdown string will be rendered as HTML. If `false`, they will be HTML-escaped (e.g., `<b>bold</b>` will become `&lt;b&gt;bold&lt;/b&gt;`).

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request on the [GitHub repository](https://github.com/callmegautam/markdownninja).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/callmegautam/markdownninja/blob/main/LICENSE) file for details.

## 👤 About the Author

**Gautam Suthar**

-   GitHub: [@callmegautam](https://github.com/callmegautam)

---

Made with ❤️ by Gautam Suthar
