export function markdownToHtml(markdown: string, options: { allowHtml?: boolean } = {}): string {
    const lines = markdown.split("\n");
    const html: string[] = [];
    let inCodeBlock = false;
    let inList = false;
    let listStack: ("ul" | "ol")[] = [];

    const closeLists = () => {
        while (listStack.length > 0) {
            const type = listStack.pop();
            html.push(`</${type}>`);
        }
    };

    for (let line of lines) {
        const originalLine = line;
        line = line.trim();

        // Code Block Start/End
        if (/^```/.test(line)) {
            inCodeBlock = !inCodeBlock;
            html.push(inCodeBlock ? "<pre><code>" : "</code></pre>");
            continue;
        }

        if (inCodeBlock) {
            html.push(escapeHtml(line));
            continue;
        }

        // Horizontal Rule
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
            closeLists();
            html.push("<hr />");
            continue;
        }

        // Headings with IDs
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            closeLists();
            const level = headingMatch[1].length;
            const contentRaw = headingMatch[2];
            const content = parseInline(contentRaw, options);
            const id = contentRaw
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            html.push(`<h${level} id="${id}">${content}</h${level}>`);
            continue;
        }

        // Blockquote
        const blockquoteMatch = line.match(/^>\s+(.*)/);
        if (blockquoteMatch) {
            closeLists();
            html.push(`<blockquote>${parseInline(blockquoteMatch[1], options)}</blockquote>`);
            continue;
        }

        // Table
        if (/^\|(.+)\|$/.test(line)) {
            const cells = line
                .split("|")
                .slice(1, -1)
                .map((cell) => cell.trim());
            const isHeader = lines[lines.indexOf(originalLine) + 1]?.match(/^\|([\s:-]+)\|$/);
            if (isHeader) {
                const headerHtml = `<thead><tr>${cells
                    .map((cell) => `<th>${parseInline(cell, options)}</th>`)
                    .join("")}</tr></thead>`;
                const bodyRows: string[] = [];
                let i = lines.indexOf(originalLine) + 2;
                while (i < lines.length && /^\|(.+)\|$/.test(lines[i])) {
                    const rowCells = lines[i]
                        .split("|")
                        .slice(1, -1)
                        .map((c) => `<td>${parseInline(c.trim(), options)}</td>`);
                    bodyRows.push(`<tr>${rowCells.join("")}</tr>`);
                    i++;
                }
                html.push(`<table>${headerHtml}<tbody>${bodyRows.join("")}</tbody></table>`);
                continue;
            }
        }

        // Ordered List
        const orderedListMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
        if (orderedListMatch) {
            const indent = orderedListMatch[1].length / 2;
            while (listStack.length > indent) html.push(`</${listStack.pop()}>`);
            while (listStack.length < indent) {
                listStack.push("ol");
                html.push("<ol>");
            }
            if (listStack[listStack.length - 1] !== "ol") {
                html.push(`</${listStack.pop()}>`);
                listStack.push("ol");
                html.push("<ol>");
            }
            html.push(`<li>${parseInline(orderedListMatch[3], options)}</li>`);
            continue;
        }

        // Unordered List / Task List
        const unorderedListMatch = line.match(/^(\s*)[-*+]\s+(.*)/);
        if (unorderedListMatch) {
            const indent = unorderedListMatch[1].length / 2;
            while (listStack.length > indent) html.push(`</${listStack.pop()}>`);
            while (listStack.length < indent) {
                listStack.push("ul");
                html.push("<ul>");
            }
            if (listStack[listStack.length - 1] !== "ul") {
                html.push(`</${listStack.pop()}>`);
                listStack.push("ul");
                html.push("<ul>");
            }
            let item = unorderedListMatch[2];
            const taskMatch = item.match(/^\[( |x|X)\]\s+(.*)/);
            if (taskMatch) {
                const checked = taskMatch[1].toLowerCase() === "x";
                html.push(
                    `<li><input type="checkbox" disabled ${checked ? "checked" : ""} /> ${parseInline(
                        taskMatch[2],
                        options
                    )}</li>`
                );
            } else {
                html.push(`<li>${parseInline(item, options)}</li>`);
            }
            continue;
        }

        // Line Breaks & Paragraphs
        closeLists();
        if (line.trim() !== "") {
            html.push(`<p>${parseInline(line, options)}</p>`);
        }
    }

    closeLists();
    return html.join("\n").trim();
}

function parseInline(text: string, options: { allowHtml?: boolean } = {}): string {
    let processed = text
        .replace(/\\\*/g, "*")
        .replace(/\\_/g, "_")
        .replace(/\\~/g, "~")
        .replace(/\\`/g, "`")
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/:\w+:/g, (match) => emojiMap[match.slice(1, -1)] || match)
        .replace(/---/g, "—")
        .replace(/--/g, "–")
        .replace(/\"([^"]*)\"/g, "“$1”")
        .replace(/\b'([^']*)'/g, "‘$1’")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/(https?:\/\/[^\s<]+[^<.,;"')\]\s])/g, '<a href="$1">$1</a>')
        .replace(/  $/, "<br />");

    if (!options.allowHtml) {
        processed = escapeHtml(processed);
    }

    return processed;
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const emojiMap: Record<string, string> = {
    smile: "😄",
    heart: "❤️",
    thumbs_up: "👍",
    fire: "🔥",
    star: "⭐",
    rocket: "🚀",
    check_mark: "✔️",
    cross_mark: "❌",
    wave: "👋",
    clap: "👏",
    ok_hand: "👌",
    thumbs_down: "👎",
};
