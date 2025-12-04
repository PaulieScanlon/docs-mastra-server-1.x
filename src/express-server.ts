import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index.js";

const app = express();
app.use(express.json());

const expressServerAdapter = new MastraServer({
  mastra,
  app,
  openapiPath: '/openapi.json'
});
await expressServerAdapter.init();

app.listen(3001, () => {
  console.log('Server is running on port 3001');
  console.log('OpenAPI spec: http://localhost:3001/openapi.json');
});
