# Server Adapter Packages

## Express Adapter
- `@mastra/express@beta`
- `@mastra/server@beta`
- `express`

## Hono Adapter
- `@mastra/hono@beta`
- `@mastra/server@beta`
- `hono`

---

## Server Adapters vs Direct Integration

Server adapters automatically register standardized Mastra API endpoints (agents, workflows, tools, memory, logs, observability, MCP, and A2A endpoints) on your Express or Hono server. This provides a complete REST API for all Mastra features with OpenAPI documentation.

**Note:** The import path for the `mastra` instance is TBD. To avoid bundling issues, it's likely imported from Mastra's build output (`.mastra/output/index`) rather than the source (`src/mastra/index`), allowing your server bundler to import already-compiled JavaScript instead of processing TypeScript.

**Key difference:**
- **Server adapters**: Call API endpoints (e.g., `POST /api/agents/weatherAgent/generate`) via HTTP requests
- **Direct integration**: Call Mastra methods directly in your code (e.g., `agent.generate()`)
  - [Integrate Mastra in your Express project](https://mastra-docs-1-kz4642mbs-kepler-ab1bf5ab.vercel.app/guides/v1/getting-started/express)

---

## Configuration Examples

### Express Adapter

`src/server.ts`

```typescript
import "dotenv/config";
import express from "express";
import { MastraServer } from "@mastra/express";
import { mastra } from "./mastra/index"; // Import your existing Mastra instance

const app = express();
app.use(express.json());

const server = new MastraServer({ mastra, app });
await server.init();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

**Note:** The `mastra` instance is imported from your existing Mastra configuration (`src/mastra/index.ts`), which includes all your agents, workflows, tools, storage, logging, and observability setup.

The adapter automatically registers all endpoints for agents, workflows, tools, memory, logs, observability, MCP, and A2A. Once the server is running, you can call the agent endpoints. For example, to invoke the `weatherAgent` (defined in `src/mastra/agents/weather-agent.ts`):

```bash
curl -X POST http://localhost:3000/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is the weather in London?"}]}'
```

Or from JavaScript/TypeScript:

```typescript
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

### Hono Adapter

`src/index.ts`

```typescript
import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { MastraServer } from "@mastra/hono";
import { mastra } from "./mastra/index"; // Import your existing Mastra instance

const app = new Hono();

const server = new MastraServer({ mastra, app });
await server.init();

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log("Server running on port 3000");
});
```

**Note:** The `mastra` instance is imported from your existing Mastra configuration (`src/mastra/index.ts`), which includes all your agents, workflows, tools, storage, logging, and observability setup.

The adapter automatically registers all endpoints for agents, workflows, tools, memory, logs, observability, MCP, and A2A. Once the server is running, you can call the agent endpoints. For example, to invoke the `weatherAgent` (defined in `src/mastra/agents/weather-agent.ts`):

```bash
curl -X POST http://localhost:3000/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "What is the weather in London?"}]}'
```

Or from JavaScript/TypeScript:

```typescript
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

## Mastra Configuration

Your Mastra instance is configured in `src/mastra/index.ts` and includes:

- **Agents**: Defined in `src/mastra/agents/` (e.g., `weatherAgent`)
- **Workflows**: Defined in `src/mastra/workflows/` (e.g., `weatherWorkflow`)
- **Tools**: Defined in `src/mastra/tools/` (e.g., `weatherTool`)
- **Scorers**: Defined in `src/mastra/scorers/` for evaluating agent performance
- **Storage**: LibSQL for observability, scores, and other data
- **Logger**: Pino logger for structured logging
- **Observability**: Mastra observability with tracing support

The server adapters automatically expose all these configured components via REST API endpoints.

## PR References

- [Server adapters](https://github.com/mastra-ai/mastra/pull/10263)
- [Unified MastraServer API with MCP transport routes](https://github.com/mastra-ai/mastra/pull/10644)
