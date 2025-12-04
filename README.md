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

## Configuration

### Express adapter

`src/express-server.ts`

```typescript
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
```

Run with: `npm run start:express` (uses `tsx`)

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

### Root Cause
The `abortSignal` in `res.locals.abortSignal` is already aborted when the handler executes, causing all OpenAI API calls to be immediately canceled.

### Temporary Workaround
Manual endpoint implementation works but loses other Mastra endpoints:

```typescript
app.post('/api/agents/:agentId/generate', async (req, res) => {
  const agent = mastra.getAgentById(req.params.agentId);
  const { messages, ...options } = req.body;
  const result = await agent.generate(messages, options);
  res.json(result);
});
```

**Recommendation:** Use `npm run dev` (mastra dev server) until this is fixed in the next beta release.

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
curl -X POST http://localhost:3001/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"What is the weather in Paris?"}]}'
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
