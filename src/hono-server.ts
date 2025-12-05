import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HonoBindings, HonoVariables, MastraServer } from "@mastra/hono";
import { mastra } from "./mastra/index.js";

const app = new Hono<{ Bindings: HonoBindings; Variables: HonoVariables }>();

const server = new MastraServer({
  app,
  mastra,
  openapiPath: '/openapi.json'
});
await server.init();

// Test route
app.get('/', (c) => {
  return c.json({ message: 'Hello World', status: 'ok' });
});

serve({
  fetch: app.fetch,
  port: 3001,
}, () => {
  console.log('Server running on port 3001');
  console.log('Test route: http://localhost:3001');
});

