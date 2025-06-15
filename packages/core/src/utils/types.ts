export interface MarkdownOptions {
    allowHtml?: boolean;
}

export interface HtmlToMarkdownOptions {
    allowHtml?: boolean;
}

export interface MarkdownPlugin {
    name: string;
    transformHtml?: (html: string) => string;
    transformMarkdown?: (markdown: string) => string;
}
