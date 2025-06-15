import { describe, it, expect } from "vitest";
import { markdownToHtml } from "../markdown-to-html";

describe("markdownToHtml", () => {
    it("should convert heading", () => {
        const md = "# Hello World";
        const html = markdownToHtml(md);
        expect(html).toContain('<h1 id="hello-world">Hello World</h1>');
    });

    it("should convert bold and italic", () => {
        const md = "**Bold** and *Italic*";
        const html = markdownToHtml(md);
        expect(html).toContain("<strong>Bold</strong>");
        expect(html).toContain("<em>Italic</em>");
    });

    it("should convert links and images", () => {
        const md = "[Link](https://example.com) ![Alt](img.png)";
        const html = markdownToHtml(md);
        expect(html).toContain('<a href="https://example.com">Link</a>');
        expect(html).toContain('<img alt="Alt" src="img.png" />');
    });

    it("should convert inline code and code blocks", () => {
        const md = "`inline` \n```\nblock\n```";
        const html = markdownToHtml(md);
        expect(html).toContain("<code>inline</code>");
        expect(html).toContain("<pre><code>block</code></pre>");
    });

    it("should convert blockquote", () => {
        const md = "> This is quoted";
        const html = markdownToHtml(md);
        expect(html).toContain("<blockquote>This is quoted</blockquote>");
    });
});
