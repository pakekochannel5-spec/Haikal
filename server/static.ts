import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Look for a build directory in a few places. In the Vercel build the
  // client is copied to the project `public/` root; when the server is
  // bundled `__dirname` may be `dist/` so check both places and fall back
  // gracefully if none are present (Vercel can serve static files itself).
  const candidates = [
    path.resolve(__dirname, "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist/public"),
  ];

  const distPath = candidates.find((p) => fs.existsSync(p));
  if (!distPath) {
    console.warn(
      "serveStatic: no client build found (checked __dirname/public, public/, dist/public). Skipping static serving.",
    );
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
