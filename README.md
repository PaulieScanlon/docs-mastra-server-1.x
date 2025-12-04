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

With server adapters, you interact with Mastra via HTTP requests (e.g., `POST /api/agents/weatherAgent/generate`) rather than calling methods directly in your code (e.g., `agent.generate()`).

---

## Importing your Mastra instance

You can import your Mastra instance in two ways: from the pre-compiled build output, or directly from TypeScript source. Choose based on your bundling setup.

### From build output (recommended)

Import from pre-compiled JavaScript - your server doesn't need to transpile Mastra code. Your server bundler only processes your server code. Mastra is already compiled to JavaScript. Faster startup, works with any bundler.

**Express example:** `src/express-server.js`

```javascript
import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "../.mastra/output/index.js"; // From build output

const app = express();
app.use(express.json());

const server = new MastraServer({ mastra, app });
await server.init();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Hono example:** `src/hono-server.js`

```javascript
import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MastraServer } from "@mastra/hono";
import { mastra } from "../.mastra/output/index.js"; // From build output

const app = new Hono();

const server = new MastraServer({ mastra, app });
await server.init();

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log("Server running on port 3000");
});
```

### From TypeScript source

Import directly from TypeScript - your runtime/bundler transpiles everything. No build step needed. Good for development with TypeScript tooling. Your bundler must handle TypeScript.

**Express example:** `src/express-server.ts`

```typescript
import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index"; // From TypeScript source

const app = express();
app.use(express.json());

const server = new MastraServer({ mastra, app });
await server.init();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Hono example:** `src/hono-server.ts`

```typescript
import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MastraServer } from "@mastra/hono";
import { mastra } from "./mastra/index"; // From TypeScript source

const app = new Hono();

const server = new MastraServer({ mastra, app });
await server.init();

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log("Server running on port 3000");
});
```

---

## Using the API

The adapter automatically registers all endpoints for agents, workflows, tools, memory, logs, observability, MCP, and A2A. Once the server is running, you can call the agent endpoints.

**With cURL:**

```bash
curl -X POST http://localhost:3000/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is the weather in London?"}]}'
```

**With fetch:**

```javascript
const response = await fetch('http://localhost:3000/api/agents/weatherAgent/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'What is the weather in London?' }]
  })
});

const result = await response.json();
console.log(result);
```

The OpenAPI documentation at `/api/openapi.json` shows all available endpoints for agents, workflows, tools, and other Mastra features.

---

## PR References

- [Server adapters](https://github.com/mastra-ai/mastra/pull/10263)
- [Unified MastraServer API with MCP transport routes](https://github.com/mastra-ai/mastra/pull/10644)
