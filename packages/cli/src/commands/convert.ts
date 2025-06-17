import fs from "node:fs/promises";
import path from "node:path";
import { markdownToHtml, htmlToMarkdown } from "@core/index";

export async function convertCommand(file: string, options: { to?: string; output?: string }) {
    if (!file) {
        console.error("❌ No input file provided.");
        process.exit(1);
    }

    const inputPath = path.resolve(file);
    const ext = path.extname(file).toLowerCase().replace(".", "");
    const to = options.to?.toLowerCase();

    if (!to || (to !== "html" && to !== "md")) {
        console.error(`❌ Invalid or missing '--to' format. Use --to html or --to md.`);
        process.exit(1);
    }

    if (ext === to) {
        console.error(`❌ File is already in .${to} format.`);
        process.exit(1);
    }

    const raw = await fs.readFile(inputPath, "utf8");

    let outputContent = "";
    let outExt = "";

    if (ext === "md" && to === "html") {
        outputContent = markdownToHtml(raw);
        outExt = ".html";
    } else if (ext === "html" && to === "md") {
        outputContent = htmlToMarkdown(raw);
        outExt = ".md";
    } else {
        console.error(`❌ Unsupported conversion from .${ext} to .${to}`);
        process.exit(1);
    }

    const outputPath = options.output ?? inputPath.replace(/\.\w+$/, outExt);

    await fs.writeFile(outputPath, outputContent, "utf8");
    console.log(`✅ Converted to ${to.toUpperCase()}: ${outputPath}`);
}
