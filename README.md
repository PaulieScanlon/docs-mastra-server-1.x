# Server Adapter Packages

## Express Adapter
- `@mastra/server-adapters-express@beta`
- `@mastra/server@beta`
- `express`

## Hono Adapter
- `@mastra/server-adapters-hono@beta`
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
import express from 'express';
import { MastraServer } from '@mastra/server-adapters-express';
// import { mastra } from '.mastra/output/index'; // TBD: Likely from build output to avoid bundling issues, or './mastra/index' if importing source

const app = express();
app.use(express.json());

// Create and initialize Mastra server
// This automatically registers all endpoints for agents, workflows, tools, memory, logs, observability, MCP, and A2A
const server = new MastraServer({
  app,
  mastra,
  openapiPath: '/api/openapi.json',
});

await server.init();

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

No need to manually add routes - the adapter automatically registers all endpoints. Once the server is running, you can call the agent endpoints. For example, to invoke the `weatherAgent`:

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
import { Hono } from 'hono';
import { MastraServer } from '@mastra/server-adapters-hono';
// import { mastra } from '.mastra/output/index'; // TBD: Likely from build output to avoid bundling issues, or './mastra/index' if importing source

const app = new Hono();

// Create and initialize Mastra server
// This automatically registers all endpoints for agents, workflows, tools, memory, logs, observability, MCP, and A2A
const server = new MastraServer({
  app,
  mastra,
  openapiPath: '/api/openapi.json',
});

await server.init();

export default app;
```

No need to manually add routes - the adapter automatically registers all endpoints. Once the server is running, you can call the agent endpoints. For example, to invoke the `weatherAgent`:

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

---

## Build Output

The `.mastra` directory is Mastra's build output directory. It contains:
- Compiled/generated files from `mastra build`
- Database files (when using file-based storage)
- Other build artifacts

This directory is automatically ignored in `.gitignore` and is created when you run Mastra commands like `mastra dev` or `mastra build`. Paths referenced in your code (like database URLs) are relative to `.mastra/output`.
