#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("VERCEL_TOKEN environment variable is required");
    process.exit(1);
  }

  const projectIdArgIndex = process.argv.findIndex((a) => a === "--project" || a === "-p");
  const projectId = projectIdArgIndex >= 0 ? process.argv[projectIdArgIndex + 1] : process.env.VERCEL_PROJECT_ID;
  if (!projectId) {
    console.error("Project id is required. Provide via --project <id> or VERCEL_PROJECT_ID env var");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), ".vercel.env.json");
  if (!fs.existsSync(filePath)) {
    console.error(".vercel.env.json not found. Create it from .vercel.env.json.example and fill values.");
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  for (const [key, cfg] of Object.entries(payload)) {
    const value = (cfg as any).value;
    const target = (cfg as any).target || ["production"];

    if (typeof value !== "string") {
      console.warn(`Skipping ${key}: value is not a string`);
      continue;
    }

    try {
      const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/env`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value, target, type: "encrypted" }),
      });

      if (res.status === 200 || res.status === 201) {
        console.log(`Created ${key}`);
      } else if (res.status === 409) {
        console.log(`${key} already exists; skipping`);
      } else {
        const txt = await res.text();
        console.error(`Failed to create ${key}: ${res.status} ${txt}`);
      }
    } catch (err) {
      console.error(`Error creating ${key}:`, err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
