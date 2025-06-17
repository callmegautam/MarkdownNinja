import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createServer } from "node:http";
import chokidar from "chokidar";
import { markdownToHtml } from "@core/index";

export async function previewCommand(file: string, options: { live?: boolean }) {
    const inputPath = path.resolve(file);
    const ext = path.extname(file).toLowerCase().replace(".", "");

    if (!["md", "html"].includes(ext)) {
        console.error(`❌ Unsupported file type ".${ext}". Only .md and .html are supported.`);
        process.exit(1);
    }

    let latestHtml = await buildHtml(file, ext);

    // 🧠 Setup a basic server
    const port = 7331;
    const server = createServer((req, res) => {
        if (req.url === "/") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(latestHtml);
        } else if (req.url === "/reload") {
            res.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            });
            res.write("\n");

            const interval = setInterval(() => {
                res.write("data: ping\n\n");
            }, 1000);

            const close = () => clearInterval(interval);
            req.on("close", close);
            req.on("end", close);
        } else {
            res.writeHead(404);
            res.end();
        }
    });

    server.listen(port, () => {
        const previewURL = `http://localhost:${port}`;
        console.log(`🌐 Preview running at ${previewURL}`);
        openInBrowser(previewURL);
    });

    // 🧠 If --live flag is passed
    if (options.live) {
        console.log("🔁 Live reload enabled. Watching for file changes...");
        chokidar.watch(inputPath).on("change", async () => {
            latestHtml = await buildHtml(file, ext);
            console.log("♻️  Reloaded preview.");
        });
    }
}

async function buildHtml(file: string, ext: string) {
    const raw = await fs.readFile(file, "utf8");
    let html = ext === "html" ? raw : markdownToHtml(raw);

    // Inject live reload if enabled
    return (
        html +
        `
    <script type="text/javascript">
      const source = new EventSource('/reload');
      source.onmessage = (e) => {
        if (e.data === 'ping') {
          window.location.reload();
        }
      };
    </script>
  `
    );
}

function openInBrowser(url: string) {
    const open =
        process.platform === "win32"
            ? `start "" "${url}"`
            : process.platform === "darwin"
            ? `open "${url}"`
            : `xdg-open "${url}"`;

    require("child_process").exec(open, () => {});
}
