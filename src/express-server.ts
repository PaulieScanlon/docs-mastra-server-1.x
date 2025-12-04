import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index";

const app = express();
app.use(express.json());

console.log("Initializing MastraServer with Express...");
const server = new MastraServer({ mastra, app });
await server.init();
console.log("MastraServer initialized");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`\nExpress server running on http://localhost:${PORT}`);
  console.log(`\nTest the weatherAgent:`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/agents/weatherAgent/generate \\`);
  console.log(`    -H 'Content-Type: application/json' \\`);
  console.log(`    -d '{"messages":[{"role":"user","content":"What is the weather in London?"}]}'`);
});

