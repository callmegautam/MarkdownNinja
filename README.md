# MarkdownNinja

Welcome to **markdownninja** — a blazing-fast Markdown ↔ HTML conversion toolkit for modern developers. It’s more than just a library — it’s an entire ecosystem built for flexibility, power, and style.

🌐 **Website & Playground (coming soon)**

<!-- :** [markdownninja.dev](https://markdownninja.dev) -->

---

## 🚀 Features (Under Development)

-   🔄 **Markdown → HTML & HTML → Markdown** with full GitHub-Flavored Markdown support
-   ⚡ **Ultra-fast** TypeScript engine with zero dependencies
-   🧱 **Works Everywhere** → Node.js, browser, CLI, serverless, etc.
-   🧩 **Plugin Support** (upcoming) → Extend parsing and conversion logic
-   🖥️ **VS Code Extension** (upcoming) → Convert inside the editor with a single command
-   🖥️ **CLI Tool** → Simple terminal interface for fast conversion
-   🌐 **Next.js Web Playground** → Try live Markdown↔HTML conversions
-   🧪 **100% Unit Tested** with a robust test suite
-   📚 **Clear & Typed API** for smooth DX

---

## 📦 Packages in This Monorepo

```
markdownninja/
├── packages/
│   ├── core/              # Main markdown↔HTML logic
│   ├── cli/               # CLI command-line interface
│   ├── playground/        # Next.js web-based playground
│   └── vscode-extension/  # VS Code plugin (coming soon)
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── LICENSE
└── README.md
```

---

## 📥 Installation (Under Development)

```bash
# Library
npm install markdownninja

```

<!-- # CLI (via npx) -->
<!-- npx markdownninja convert -i file.md -o file.html -->

---

## ✨ Usage

### Convert Markdown → HTML

```ts
import { markdownToHtml } from "markdownninja";
const markdown = "# Hello World";
const html = markdownToHtml(markdown);
console.log(html); // <h1>Hello World</h1>
```

### Convert HTML → Markdown

```ts
import { htmlToMarkdown } from "markdownninja";
const html = "<h1>Hello</h1>";
const markdown = htmlToMarkdown(html);
console.log(markdown); // # Hello
```

---

## 🔧 CLI Usage

```bash
npx markdownninja convert -i input.md -o output.html
```

### CLI Flags

-   `-i`, `--input` – Input file path
-   `-o`, `--output` – Output file path
-   `-r`, `--reverse` – Convert HTML → Markdown
-   `-w`, `--watch` – Auto-convert on file change

---

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
If you have ideas, improvements, or want to squash bugs — go for it! 🧠

### How to contribute

1. Fork this repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push your branch (`git push origin feature/my-feature`)
5. Open a Pull Request 🚀

---

## 💬 Let’s Connect

-   🧑‍💻 **GitHub:** [callmegautam](https://github.com/callmegautam)
-   🐦 **X (Twitter):** [@iamgautamsuthar](https://x.com/iamgautamsuthar)
-   📧 **Email:** [iamgautamsuthar@gmail.com](mailto:iamgautamsuthar@gmail.com)

Built with ⚙️, ✨, and markdown magic by [Gautam Suthar](https://github.com/callmegautam).

---

⭐ If you like this project, **please star it** — it helps more developers discover **markdownninja**!
