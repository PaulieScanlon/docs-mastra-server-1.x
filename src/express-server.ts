import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index.js";

const app = express();
app.use(express.json());

const server = new MastraServer({
  app,
  mastra,
  openapiPath: '/openapi.json'
});
await server.init();

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World', status: 'ok' });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
  console.log('Test route: http://localhost:3001');
});
