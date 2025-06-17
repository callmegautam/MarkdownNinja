import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["bin/ninja.ts"],
    format: ["cjs"],
    outDir: "dist",
    clean: true,
    target: "node18",
    // banner: {
    //     js: "#!/usr/bin/env node",
    // },
    outExtension({ format }) {
        return {
            js: ".js",
        };
    },
});
