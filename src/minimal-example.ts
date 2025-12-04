import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";

// Create a minimal agent
const testAgent = new Agent({
  id: 'test-agent',
  name: 'Test Agent',
  instructions: 'You are a helpful assistant.',
  model: 'openai/gpt-4o',
});

// Create Mastra instance
const mastra = new Mastra({
  agents: { testAgent },
});

// Create Express app
const app = express();
app.use(express.json());

// Create MastraServer
const server = new MastraServer({
  app,
  mastra,
});

// Initialize - registers context middleware, auth middleware, and routes
await server.init();

// Get the app instance from the server (as per docs)
const serverApp = server.getApp();

// Start server
serverApp.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
  console.log('Test: curl -X POST http://localhost:3001/api/agents/test-agent/generate -H "Content-Type: application/json" -d \'{"messages":[{"role":"user","content":"Say hello"}]}\'');
});

