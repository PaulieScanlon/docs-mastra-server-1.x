import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MastraServer } from "@mastra/hono";
// Import from the compiled JavaScript output instead of TypeScript source
import { mastra } from "../.mastra/output/index.js";

const app = new Hono();

console.log("Initializing MastraServer with Hono...");
const server = new MastraServer({ mastra, app });
await server.init();
console.log("MastraServer initialized");

const PORT = 3002;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\nHono server running on http://localhost:${PORT}`);
  console.log(`\nTest the weatherAgent:`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/agents/weatherAgent/generate \\`);
  console.log(`    -H 'Content-Type: application/json' \\`);
  console.log(`    -d '{"messages":[{"role":"user","content":"What is the weather in London?"}]}'`);
});

