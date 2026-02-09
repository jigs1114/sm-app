import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import { createGzip } from "zlib";
import { promisify } from "util";
import { pipeline } from "stream";

const pipelineAsync = promisify(pipeline);

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const agentFolderPath = path.join(process.cwd(), "agent");

    // Check if agent folder exists
    if (!fs.existsSync(agentFolderPath)) {
      return NextResponse.json(
        { error: "Agent folder not found" },
        { status: 404 }
      );
    }

    // Create a temporary file path for the zip
    const tempDir = path.join(process.cwd(), ".tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const zipFileName = `monitor-agent-${Date.now()}.tar.gz`;
    const zipFilePath = path.join(tempDir, zipFileName);

    // Import archiver dynamically
    const archiver = (await import("archiver")).default;

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("tar", { gzip: true });

    // Handle archive events
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve());
      archive.on("error", (err) => reject(err));
      output.on("error", (err) => reject(err));

      archive.pipe(output);
      
      // Add files from agent folder, excluding .venv and __pycache__
      archive.glob("**/*", {
        cwd: agentFolderPath,
        ignore: ["**/.venv/**", "**/__pycache__/**", "**/.*"],
      });

      archive.finalize();
    });

    // Read the zip file
    const fileContent = fs.readFileSync(zipFilePath);

    // Clean up temp file
    fs.unlinkSync(zipFilePath);

    // Return the zip file
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": 'attachment; filename="monitor-agent.tar.gz"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to generate download" },
      { status: 500 }
    );
  }
}
