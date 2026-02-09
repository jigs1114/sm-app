import { NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { PassThrough } from "stream";

export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
  try {
    const agentFolderPath = path.join(process.cwd(), "agent");

    if (!fs.existsSync(agentFolderPath)) {
      return new Response(JSON.stringify({ error: "Agent folder not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // Ensure this route runs in the Node runtime (archiver requires Node APIs)
    // (Next will use nodejs runtime when this export is present)
    // eslint-disable-next-line import/extensions
    // Dynamically import `archiver` and support both CJS and ESM shapes
    const archiverModule = await import("archiver");
    const archiver = (archiverModule as any).default ?? (archiverModule as any);
    const archive = archiver("zip", { zlib: { level: 5 } });

    const passthrough = new PassThrough();

    archive.on("error", (err: any) => {
      console.error("Archiver error:", err);
      try {
        passthrough.destroy(err);
      } catch (_) {}
    });

    archive.pipe(passthrough);

    // Add all files from the agent folder, excluding virtual envs, caches and dotfiles
    archive.glob("**/*", {
      cwd: agentFolderPath,
      ignore: ["**/.venv/**", "**/__pycache__/**", "**/.*"],
    });

    // finalize the archive (async)
    archive.finalize();

    const headers = new Headers({
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="monitor-agent.zip"',
      "Cache-Control": "no-store",
    });

    return new Response(passthrough as any, { status: 200, headers });
  } catch (error) {
    console.error("Download error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate archive" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
