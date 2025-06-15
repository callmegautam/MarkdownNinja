import { describe, it, expect } from "vitest";
import { htmlToMarkdown } from "../html-to-markdown";

describe("htmlToMarkdown", () => {
    it("should convert heading", () => {
        const html = "<h1>Hello</h1>";
        const md = htmlToMarkdown(html);
        expect(md).toBe("# Hello");
    });

    it("should convert bold and italic", () => {
        const html = "<strong>Bold</strong> <em>Italic</em>";
        const md = htmlToMarkdown(html);
        expect(md).toBe("**Bold** *Italic*");
    });

    it("should convert links and images", () => {
        const html = '<a href="https://x.com">X</a> <img alt="Alt" src="img.png">';
        const md = htmlToMarkdown(html);
        expect(md).toBe("[X](https://x.com) ![Alt](img.png)");
    });

    it("should convert inline code and code blocks", () => {
        const html = "<p><code>inline</code></p><pre><code>block</code></pre>";
        const md = htmlToMarkdown(html);
        expect(md).toContain("`inline`");
        expect(md).toContain("```\nblock\n```");
    });

    it("should convert blockquote", () => {
        const html = "<blockquote>Quote</blockquote>";
        const md = htmlToMarkdown(html);
        expect(md).toBe("> Quote");
    });
});
