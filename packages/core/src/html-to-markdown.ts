export function htmlToMarkdown(html: string): string {
    let md = html;

    // Headings
    for (let i = 6; i >= 1; i--) {
        const tag = `h${i}`;
        const regex = new RegExp(`<${tag}>(.*?)</${tag}>`, "gi");
        md = md.replace(regex, (_, content) => `${"#".repeat(i)} ${content}`);
    }

    // Bold
    md = md.replace(/<(strong|b)>(.*?)<\/\1>/gi, "**$2**");

    // Italic
    md = md.replace(/<(em|i)>(.*?)<\/\1>/gi, "*$2*");

    // Inline code
    md = md.replace(/<code>(.*?)<\/code>/gi, "`$1`");

    // Unordered lists
    md = md.replace(/<ul>\s*([\s\S]*?)\s*<\/ul>/gi, (_, content) => {
        return content.replace(/<li>(.*?)<\/li>/gi, (_: any, li: any) => `- ${li.trim()}`).trim();
    });

    // Paragraphs
    md = md.replace(/<p>(.*?)<\/p>/gi, "$1\n");

    // Remove other tags
    md = md.replace(/<[^>]+>/g, "");

    // Cleanup
    return md.trim();
}
