import { cac } from "cac";
import { convertCommand } from "./commands/convert";
import { watchCommand } from "./commands/watch";
import { previewCommand } from "./commands/preview";

const cli = cac("ninja");

// Convert command
cli.command("convert <file>", "Convert between Markdown and HTML")
    .option("--to <format>", "Target format (md | html)")
    .option("--output <path>", "Specify output file path")
    .action(convertCommand);

// Watch command
cli.command("watch <file>", "Watch a Markdown or HTML file and auto-convert on change")
    .option("--output <path>", "Specify output file path")
    .action(watchCommand);

cli.command("preview <file>", "Preview a Markdown or HTML file in browser")
    .option("--live", "Enable live reload on changes")
    .action(previewCommand);

cli.help();
cli.version("0.1.0");

export { cli };
