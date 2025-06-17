# MarkdownNinja CLI

![npm version](https://img.shields.io/npm/v/markdownninja-cli?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/markdownninja-cli?style=flat-square)
![License](https://img.shields.io/npm/l/markdownninja-cli?style=flat-square)

A powerful and minimal **CLI** for Markdown ↔ HTML conversion powered by `markdownninja`. Convert, preview, and watch your Markdown or HTML files with blazing fast performance right from your terminal.

## ✨ Features

-   **Markdown to HTML:** Convert clean Markdown into semantic, accessible HTML.
-   **HTML to Markdown:** Convert complex HTML into readable and clean Markdown.
-   **Live Preview:** Spin up a local server to preview Markdown or HTML with live reload.
-   **Watch Mode:** Automatically re-convert files on save.
-   **Smart Detection:** Auto detects file type from extension.

## 🚀 Installation

Install globally using your favorite package manager:

```bash
npm install -g markdownninja-cli
# or
pnpm add -g markdownninja-cli
# or
yarn global add markdownninja-cli
```

## 💡 Usage

### Convert Markdown or HTML

```bash
ninja convert input.md --out output.html
ninja convert input.html --out output.md
```

### Live Preview

```bash
ninja preview input.md
ninja preview input.html
```

This starts a server at `http://localhost:7331` with automatic reload on file change.

### Watch & Auto-Convert

```bash
ninja watch input.md --out output.html
ninja watch input.html --out output.md
```

Whenever the input file changes, it will be re-converted and output will be updated.

---

## 🛠️ CLI API

### `ninja convert <input> --out <output>`

-   Converts a single file from Markdown → HTML or HTML → Markdown.
-   If `--out` is omitted, output is printed to stdout.

### `ninja preview <input>`

-   Starts a live preview server on `http://localhost:7331`.
-   Reloads automatically on file save.
-   Supports both `.md` and `.html`.

### `ninja watch <input> --out <output>`

-   Watches input file for changes.
-   Re-converts automatically whenever the file changes.
-   Ideal for automated workflows.

---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](https://github.com/callmegautam/markdownninja/blob/main/LICENSE) file for details.

## 👤 About the Author

**Gautam Suthar**

-   GitHub: [@callmegautam](https://github.com/callmegautam)

---

Made with ❤️ by Gautam Suthar
