# API Reference

Base URL:

```text
http://localhost:3000
```

## Generate

```http
POST /ai/generate
Content-Type: application/json
```

```json
{
  "platform": "facebook",
  "type": "caption",
  "topic": "How AI automation helps small businesses",
  "tone": "friendly",
  "audience": "small business owners",
  "provider": "openrouter"
}
```

## Execute Pipeline

```http
POST /pipelines/ai-generation/execute
```

```json
{
  "input": {
    "platform": "linkedin",
    "type": "post",
    "topic": "AI workflow automation",
    "tone": "professional",
    "audience": "business owners",
    "provider": "gemini"
  },
  "options": {
    "executionId": "n8n-demo-001",
    "metadata": {
      "source": "n8n"
    }
  }
}
```

## Execution APIs

```text
GET  /executions
GET  /executions/:executionId
GET  /executions/stats
POST /executions/:executionId/replay
```

Query options for `/executions`:

- `pipeline`
- `status`
- `limit`
- `offset`

## Platform APIs

```text
GET /health
GET /providers
GET /pipelines
GET /monitoring
GET /dashboard
```
