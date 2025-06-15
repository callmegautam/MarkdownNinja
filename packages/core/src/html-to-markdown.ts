export function htmlToMarkdown(html: string, options: { allowHtml?: boolean } = {}): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const lines: string[] = [];

    function escapeMarkdown(text: string) {
        return text.replace(/\\/g, "\\\\").replace(/[*_`[\]]/g, "\\$&");
    }

    function walk(node: Node): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || "";
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        const content = Array.from(el.childNodes).map(walk).join("");

        switch (tag) {
            case "h1":
                return `# ${content}\n`;
            case "h2":
                return `## ${content}\n`;
            case "h3":
                return `### ${content}\n`;
            case "h4":
                return `#### ${content}\n`;
            case "h5":
                return `##### ${content}\n`;
            case "h6":
                return `###### ${content}\n`;

            case "strong":
            case "b":
                return `**${content}**`;

            case "em":
            case "i":
                return `*${content}*`;

            case "code":
                return `\`${content}\``;

            case "a":
                const href = el.getAttribute("href");
                return href ? `[${content}](${href})` : content;

            case "img":
                const alt = el.getAttribute("alt") || "";
                const src = el.getAttribute("src") || "";
                return `![${alt}](${src})`;

            case "ul":
                return Array.from(el.children)
                    .map((li) => walkListItem(li, "-", 0))
                    .join("");

            case "ol":
                return Array.from(el.children)
                    .map((li, i) => walkListItem(li, `${i + 1}.`, 0))
                    .join("");

            case "li":
                return `- ${content}\n`;

            case "input":
                if (el instanceof HTMLInputElement && el.type === "checkbox") {
                    return el.checked ? "[x] " : "[ ] ";
                }
                return "";

            case "blockquote":
                return content
                    .split("\n")
                    .map((line) => `> ${line}`)
                    .join("\n");

            case "pre":
                const code = el.textContent || "";
                return `\n\`\`\`\n${code.trim()}\n\`\`\`\n`;

            case "br":
                return "  \n";

            case "p":
                return `${content}\n`;

            case "table":
                return walkTable(el);

            default:
                return options.allowHtml ? el.outerHTML : content;
        }
    }

    function walkListItem(li: Node, prefix: string, indent: number): string {
        if (!(li instanceof HTMLElement)) return "";

        const checkbox = li.querySelector("input[type='checkbox']") as HTMLInputElement | null;
        let content = Array.from(li.childNodes)
            .filter((n) => !(n instanceof HTMLInputElement)) // skip checkbox node from content
            .map(walk)
            .join("");

        const checkmark = checkbox ? (checkbox.checked ? "[x] " : "[ ] ") : "";
        return `${"  ".repeat(indent)}${prefix} ${checkmark}${content}\n`;
    }

    function walkTable(table: HTMLElement): string {
        const rows = Array.from(table.getElementsByTagName("tr"));
        const headerCells = rows[0]?.querySelectorAll("th") || [];

        const header = headerCells.length
            ? `| ${Array.from(headerCells)
                  .map((cell) => cell.textContent?.trim() || "")
                  .join(" | ")} |\n` + `| ${Array(headerCells.length).fill("---").join(" | ")} |`
            : "";

        const body = rows
            .slice(1)
            .map((row) => {
                const cells = Array.from(row.querySelectorAll("td"));
                return `| ${cells.map((cell) => cell.textContent?.trim() || "").join(" | ")} |`;
            })
            .join("\n");

        return `${header}\n${body}\n`;
    }

    for (const child of Array.from(doc.body.childNodes)) {
        const line = walk(child).trim();
        if (line) lines.push(line);
    }

    return lines.join("\n\n").trim();
}
