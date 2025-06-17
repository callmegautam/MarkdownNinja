import fs from "node:fs/promises";
import path from "node:path";
import { watch as chokidarWatch } from "chokidar";
import { markdownToHtml, htmlToMarkdown } from "@core/index";

export async function watchCommand(file: string, options: { output?: string }) {
    const inputPath = path.resolve(file);
    const ext = path.extname(file).toLowerCase().replace(".", "");

    if (!["md", "html"].includes(ext)) {
        console.error(`❌ Unsupported file type ".${ext}". Only .md and .html are supported.`);
        process.exit(1);
    }

    const convert = async () => {
        try {
            const raw = await fs.readFile(inputPath, "utf8");
            const outputContent = ext === "md" ? markdownToHtml(raw) : htmlToMarkdown(raw);

            const outExt = ext === "md" ? ".html" : ".md";
            const outputPath = options.output ?? inputPath.replace(/\.\w+$/, outExt);

            await fs.writeFile(outputPath, outputContent, "utf8");
            console.log(`🔁 Updated: ${outputPath}`);
        } catch (err) {
            console.error(`❌ Error during conversion:`, err);
        }
    };

    console.log(`👀 Watching file: ${inputPath}`);
    await convert();

    chokidarWatch(inputPath).on("change", () => {
        console.log(`📦 Detected change, converting...`);
        convert();
    });
}
