// src/markdownToHtml.ts

export function markdownToHtml(markdown: string): string {
    const lines = markdown.split("\n");
    const html: string[] = [];
    let inCodeBlock = false;
    let inList = false;
    let listType: "ul" | "ol" | null = null;

    for (let line of lines) {
        line = line.trim();

        // Code Block Start/End (``` language optional)
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
            html.push("<hr />");
            continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const content = parseInline(headingMatch[2]);
            html.push(`<h${level}>${content}</h${level}>`);
            continue;
        }

        // Blockquote
        const blockquoteMatch = line.match(/^>\s+(.*)/);
        if (blockquoteMatch) {
            html.push(`<blockquote>${parseInline(blockquoteMatch[1])}</blockquote>`);
            continue;
        }

        // Ordered List
        const orderedListMatch = line.match(/^\d+\.\s+(.*)/);
        if (orderedListMatch) {
            if (!inList || listType !== "ol") {
                if (inList) html.push(`</${listType}>`);
                inList = true;
                listType = "ol";
                html.push("<ol>");
            }
            html.push(`<li>${parseInline(orderedListMatch[1])}</li>`);
            continue;
        }

        // Unordered List
        const unorderedListMatch = line.match(/^[-*+]\s+(.*)/);
        if (unorderedListMatch) {
            if (!inList || listType !== "ul") {
                if (inList) html.push(`</${listType}>`);
                inList = true;
                listType = "ul";
                html.push("<ul>");
            }
            html.push(`<li>${parseInline(unorderedListMatch[1])}</li>`);
            continue;
        }

        // End list block if needed
        if (inList) {
            html.push(`</${listType}>`);
            inList = false;
            listType = null;
        }

        // Paragraph (if not empty)
        if (line.trim() !== "") {
            html.push(`<p>${parseInline(line)}</p>`);
        }
    }

    // Final closing list if any
    if (inList) {
        html.push(`</${listType}>`);
    }

    return html.join("\n").trim();
}

function parseInline(text: string): string {
    return text
        .replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />') // Images
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // Links
        .replace(/`([^`]+)`/g, "<code>$1</code>") // Inline code
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
        .replace(/\*(.*?)\*/g, "<em>$1</em>"); // Italic
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
