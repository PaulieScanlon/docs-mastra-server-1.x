import "dotenv/config";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MastraServer } from "@mastra/hono";

const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "You are a helpful assistant.",
  model: "openai/gpt-5.1",
});

const mastra = new Mastra({
  agents: { testAgent },
});

const app = new Hono();

// Add a test route to verify Hono is working
app.get("/test", (c) => {
  return c.json({ message: "Hono is working!" });
});

console.log("Initializing MastraServer...");
const server = new MastraServer({ mastra, app });
await server.init();
console.log("MastraServer initialized");

const PORT = 3002;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Test basic route: curl http://localhost:${PORT}/test`);
  console.log(`Test agent: curl -X POST http://localhost:${PORT}/api/agents/test-agent/generate -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"Hello"}]}'`);
});

