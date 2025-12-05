# Server Adapter Packages

## Express adapter
- `@mastra/express@beta`
- `@mastra/server@beta`
- `express`

## Hono adapter
- `@mastra/hono@beta`
- `@mastra/server@beta`
- `hono`

---

## What are server adapters?

Server adapters automatically register standardized Mastra API endpoints (agents, workflows, tools, memory, logs, observability, MCP, and A2A endpoints) on your Express or Hono server. This provides a complete REST API for all Mastra features with OpenAPI documentation.

With server adapters, you interact with Mastra via HTTP requests (e.g., `POST /api/agents/weather-agent/generate`) rather than calling methods directly in your code (e.g., `agent.generate()`).

---

## Configuration

### Express adapter

Server adapters let you use your own HTTP server instead of `mastra build`. You import your Mastra instance from source and use `tsx` to run TypeScript directly.

**Note:** `mastra build` creates a standalone server, not a module to import. Adapters are for when you want full control over your server setup.

`src/express-server.ts`

```typescript
import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index.js"; // From TypeScript source

const app = express();
app.use(express.json());

const server = new MastraServer({
  app,
  mastra,
  openapiPath: '/openapi.json'
});
await server.init();

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

Run with: `npm run start:express`

### Hono adapter

Server adapters let you use your own HTTP server instead of `mastra build`. You import your Mastra instance from source and use `tsx` to run TypeScript directly.

**Note:** `mastra build` creates a standalone server, not a module to import. Adapters are for when you want full control over your server setup.

`src/hono-server.ts`

```typescript
import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { HonoBindings, HonoVariables, MastraServer } from "@mastra/hono";
import { mastra } from "./mastra/index.js"; // From TypeScript source

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
```

Run with: `npm run start:hono`

---

## Known Issue with @mastra/express@0.0.2-beta.1

**The Express adapter currently returns empty responses from agent endpoints.**

See [ISSUE.md](./ISSUE.md) for full details.

### Symptoms
- ❌ Agent endpoints return `{"text": "", "usage": {}, "totalUsage": {"totalTokens": 0}}`
- ✅ Direct agent calls work fine
- ✅ `mastra dev` works fine with the same mastra instance
- ✅ OpenAPI endpoints work
- ✅ Server initializes without errors

### Observations
When passing `res.locals.abortSignal` to `agent.generate()`, it returns empty responses. The signal shows as already aborted.

---

## Testing

### Verify Direct Agent Works

```bash
npx tsx src/test-weather-agent.ts
```

Should return actual weather data.

### Verify Mastra Dev Works

```bash
npm run dev
# In another terminal:
curl -X POST http://localhost:3001/api/agents/weather-agent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is the weather in London?"}]}' \
  | jq -r '.text'
```

Should return actual weather data with text and token usage.

### Verify Express Adapter Issue

```bash
npm run start:express
```

Currently returns empty text and 0 tokens (see ISSUE.md for details).

---

## PR References

- [Server adapters](https://github.com/mastra-ai/mastra/pull/10263)
- [Unified MastraServer API with MCP transport routes](https://github.com/mastra-ai/mastra/pull/10644)
