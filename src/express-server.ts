import "dotenv/config";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import express from "express";
import { MastraServer } from "@mastra/express";

const testAgent = new Agent({
  id: "test-agent",
  name: "Test Agent",
  instructions: "You are a helpful assistant.",
  model: "openai/gpt-5.1",
});

const mastra = new Mastra({
  agents: { testAgent },
});

const app = express();
app.use(express.json());

// Add a test route to verify Express is working
app.get("/test", (req, res) => {
  res.json({ message: "Express is working!" });
});

console.log("Initializing MastraServer...");
const server = new MastraServer({ mastra, app });
await server.init();
console.log("MastraServer initialized");

// Log all registered routes
console.log("\nAttempting to list registered routes...");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`\nServer running on port ${PORT}`);
  console.log(`Test basic route: curl http://localhost:${PORT}/test`);
  console.log(`Test agent: curl -X POST http://localhost:${PORT}/api/agents/test-agent/generate -H 'Content-Type: application/json' -d '{"messages":[{"role":"user","content":"Hello"}]}'`);
});

