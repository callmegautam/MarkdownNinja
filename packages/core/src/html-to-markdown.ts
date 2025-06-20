import { parseHTML } from "linkedom";

export function htmlToMarkdown(html: string, options: { allowHtml?: boolean } = {}): string {
    const wrappedHtml = `<!DOCTYPE html><html><head></head><body>${html}</body></html>`;
    const { document } = parseHTML(wrappedHtml);
    if (!document.defaultView) {
        throw new Error("No defaultView in document");
    }
    const Node = document.defaultView.Node;

    const lines: string[] = [];

    if (!document || !document.body) {
        return "No content";
    }

    // console.log(document.body.childNodes.length);

    function escapeMarkdown(text: string): string {
        return text.replace(/\\/g, "\\\\").replace(/([*_`[\]~>])/g, "\\$1");
    }

    function walk(node: Node, depth = 0): string {
        if (node.nodeType === Node.TEXT_NODE) {
            return escapeMarkdown(node.textContent || "");
        }

        if (node.nodeType === Node.COMMENT_NODE) {
            return "";
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();
        const content = walkChildren(el, depth);

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

            case "del":
            case "s":
            case "strike":
                return `~~${content}~~`;

            case "a": {
                const href = el.getAttribute("href");
                return href ? `[${content}](${href})` : content;
            }

            case "img": {
                const alt = el.getAttribute("alt") || "";
                const src = el.getAttribute("src") || "";
                return `![${alt}](${src})`;
            }

            case "ul":
                return Array.from(el.children)
                    .map((li) => walkListItem(li, "-", depth))
                    .join("");

            case "ol":
                return Array.from(el.children)
                    .map((li, i) => walkListItem(li, `${i + 1}.`, depth))
                    .join("");

            case "li":
                return `${"  ".repeat(depth)}- ${content}\n`;

            case "input":
                if (el instanceof HTMLInputElement && el.type === "checkbox") {
                    return el.checked ? "[x] " : "[ ] ";
                }
                return "";

            case "blockquote":
                return (
                    content
                        .split("\n")
                        .map((line) => (line.trim() ? `${"> ".repeat(depth + 1)}${line}` : ""))
                        .join("\n") + "\n"
                );

            case "pre": {
                const codeEl = el.querySelector("code");
                const code = codeEl ? codeEl.textContent || "" : el.textContent || "";
                return `\n\`\`\`\n${code.trim()}\n\`\`\`\n`;
            }

            case "br":
                return "  \n";

            case "p": {
                const text = content.trim();
                if (text.includes("\n")) return `${text}\n\n`; // true block
                return `${text} `; // inline style
            }

            case "table":
                return walkTable(el);

            case "span":
                return content;

            default:
                return options.allowHtml ? el.outerHTML : content;
        }
    }

    function walkChildren(el: Element, depth: number): string {
        return Array.from(el.childNodes)
            .map((child) => walk(child, depth))
            .join("");
    }

    function walkListItem(li: Node, prefix: string, indent: number): string {
        if (!(li instanceof HTMLElement)) return "";

        const checkbox = li.querySelector("input[type='checkbox']") as HTMLInputElement | null;
        let content = Array.from(li.childNodes)
            .filter((n) => !(n instanceof HTMLInputElement)) // skip checkbox from childNodes
            .map((child) => walk(child, indent + 1))
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
                  .join(" | ")} |\n| ${Array(headerCells.length).fill("---").join(" | ")} |`
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

    return Array.from(document.body.childNodes)
        .map((child) => walk(child))
        .join("")
        .trim();

    // --- version 2 ---

    // for (const child of Array.from(document.body.childNodes)) {
    //     const line = walk(child).trim();
    //     if (line) lines.push(line);
    // }

    // return lines.join("\n");

    // --- version 1 ---

    // for (const child of Array.from(doc.body.childNodes)) {
    //     const line = walk(child).trim();
    //     if (line) lines.push(line);
    // }

    // return lines.join("\n\n").trim();
}
