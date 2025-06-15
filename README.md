# MarkdownNinja 🥷

Welcome to **markdownninja** — a blazing-fast Markdown ↔ HTML conversion toolkit for modern developers. It’s more than just a library — it’s an entire ecosystem built for flexibility, power, and style.

![npm version](https://img.shields.io/npm/v/markdownninja?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/markdownninja?style=flat-square)
![License](https://img.shields.io/npm/l/markdownninja?style=flat-square)

🌐 **Website & Playground (coming soon)**

<!-- :** [markdownninja.dev](https://markdownninja.dev) -->

---

## 🚀 Features

-   **🔄 Markdown → HTML & HTML → Markdown** with extensive support for common Markdown and HTML structures.
-   **⚡ Ultra-fast** TypeScript engine with **zero direct runtime dependencies** (the `core` package uses `linkedom` as a peer dependency for HTML parsing in Node.js, ensuring a lightweight footprint).
-   **🧱 Works Everywhere** → Node.js, browser (with appropriate polyfills/bundling for `linkedom`), CLI, serverless, etc.
-   **🧩 Plugin Support** (upcoming) → Extend parsing and conversion logic.
-   **🖥️ VS Code Extension** (upcoming) → Convert inside the editor with a single command.
-   **🖥️ CLI Tool** → Simple terminal interface for fast conversion.
-   **🌐 Next.js Web Playground** → Try live Markdown↔HTML conversions.
-   **🧪 100% Unit Tested** with a robust test suite.
-   **📚 Clear & Typed API** for smooth Developer Experience.
-   **Smart Formatting:** Attempts to produce clean and readable Markdown/HTML, including handling of task lists (`[ ]` / `[x]`).

---

## 📦 Packages in This Monorepo

```
markdownninja/
├── packages/
│   ├── core/              # Main markdown↔HTML conversion logic (the `markdownninja` npm package)
│   ├── cli/               # CLI command-line interface
│   ├── playground/        # Next.js web-based playground
│   └── vscode-extension/  # VS Code plugin (coming soon)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── LICENSE
└── README.md
```

---

## 📥 Installation

### Core Library (`markdownninja`)

You can install the core `markdownninja` library using npm or yarn:

```bash
npm install markdownninja
# or
yarn add markdownninja
```

<!--
**Note on `linkedom`:** `markdownninja` (the `@markdownninja/core` package) uses `linkedom` as a peer dependency for its HTML-to-Markdown conversion functionality in Node.js environments. `linkedom` is a very fast and lightweight DOM parser. Make sure to install it alongside `markdownninja`. -->

<!-- ### CLI Tool

The CLI tool can be used directly via `npx` or installed globally:

```bash
# Using npx (recommended for one-off use)
npx markdownninja convert -i file.md -o file.html

# Global installation (if you want to use `markdownninja` command directly)
npm install -g @markdownninja/cli
markdownninja convert -i file.md -o file.html
```

--- -->

## ✨ Usage

### Convert Markdown → HTML

The `markdownToHtml` function offers robust conversion from Markdown to HTML.

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

// Option: allowHtml (default: true) - If false, raw HTML in markdown will be escaped.
const markdownWithHtmlInput = `This is <b>bold</b> HTML.`;
const htmlWithEscapedHtml = markdownToHtml(markdownWithHtmlInput, { allowHtml: false });
console.log(htmlWithEscapedHtml);
// Output: <p>This is &lt;b&gt;bold&lt;/b&gt; HTML.</p>

const htmlWithAllowedHtml = markdownToHtml(markdownWithHtmlInput, { allowHtml: true });
console.log(htmlWithAllowedHtml);
// Output: <p>This is <b>bold</b> HTML.</p>
```

### Convert HTML → Markdown

The `htmlToMarkdown` function converts an HTML string into a Markdown string, preserving structure where possible.

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

// Option: allowHtml (default: false) - If true, unknown HTML tags are kept as-is.
const htmlWithUnknownTag = `<p>Hello <unknown-tag>world</unknown-tag>!</p>`;
const markdownWithHtml = htmlToMarkdown(htmlWithUnknownTag, { allowHtml: true });
console.log(markdownWithHtml);
// Output: Hello <unknown-tag>world</unknown-tag>!
```

---

## 🛠️ Core Library API (`markdownninja` package)

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

---

<!--
## 🔧 CLI Usage

The `markdownninja` CLI provides a convenient way to convert files directly from your terminal.

```bash
npx markdownninja convert -i input.md -o output.html
```

### CLI Flags

-   `-i`, `--input <path>` – Input file path (e.g., `file.md`, `file.html`).
-   `-o`, `--output <path>` – Output file path (e.g., `file.html`, `file.md`).
-   `-r`, `--reverse` – Specify that the conversion should be HTML → Markdown (default is Markdown → HTML based on input/output extensions or explicit flag).
-   `-w`, `--watch` – Auto-convert on file changes in the input path.

--- -->

## 🛣️ Upcoming Features

-   🧩 Plugin system for custom Markdown/HTML handlers
-   🧾 Export to PDF, Docx, MDX
-   💬 AI-assisted semantic diffs
-   🗂️ GitHub Action for automated markdown processing
-   ☁️ Cloud sync for playground usage
-   🌍 Localization and multi-language support

---

## 🤝 Contributing

Pull requests and contributions are **super welcome**!
If you find a bug, have ideas for improvements, or want to squash bugs — go for it! 🧠

### How to contribute

1.  Fork this repo.
2.  Create a new branch (`git checkout -b feature/my-new-feature`).
3.  Commit your changes (`git commit -m 'feat: Add my new feature'`).
4.  Push your branch (`git push origin feature/my-new-feature`).
5.  Open a Pull Request 🚀.

---

## 💬 Let’s Connect

-   🧑‍💻 **GitHub:** [callmegautam](https://github.com/callmegautam)
-   🐦 **X (Twitter):** [@iamgautamsuthar](https://x.com/iamgautamsuthar)
-   📧 **Email:** [iamgautamsuthar@gmail.com](mailto:iamgautamsuthar@gmail.com)

Built with ⚙️, ✨, and markdown magic by [Gautam Suthar](https://github.com/callmegautam).

---

⭐ If you like this project, **please star it** — it helps more developers discover **markdownninja**!
