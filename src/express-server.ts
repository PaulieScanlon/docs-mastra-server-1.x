import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index.js";

const app = express();
app.use(express.json());

const server = new MastraServer({
  mastra,
  app,
  openapiPath: '/openapi.json'
});
await server.init();

// Get the app instance from the server
const serverApp = server.getApp();

serverApp.listen(3001, () => {
  console.log('Server is running on port 3001');
  console.log('OpenAPI spec: http://localhost:3001/openapi.json');
});
