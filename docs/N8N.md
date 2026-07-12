# n8n Integration Guide

## URL Selection

n8n running directly on the same machine:

```text
http://localhost:3000
```

n8n in Docker, AI Social Agent on the Windows host:

```text
http://host.docker.internal:3000
```

## First Workflow

```text
Manual Trigger
  ↓
Set: topic
  ↓
HTTP Request
  ↓
Use generated output
```

HTTP Request settings:

```text
Method: POST
URL: http://host.docker.internal:3000/ai/generate
Send Body: JSON
```

Body:

```json
{
  "platform": "facebook",
  "type": "caption",
  "topic": "={{ $json.topic }}",
  "tone": "friendly",
  "audience": "small business owners",
  "provider": "openrouter"
}
```

## Pipeline Execution with n8n Metadata

```http
POST /pipelines/ai-generation/execute
```

```json
{
  "input": {
    "platform": "linkedin",
    "type": "post",
    "topic": "={{ $json.topic }}",
    "tone": "professional",
    "audience": "business owners",
    "provider": "gemini"
  },
  "options": {
    "executionId": "={{ 'n8n-' + $execution.id }}",
    "metadata": {
      "source": "n8n",
      "workflowId": "={{ $workflow.id }}",
      "workflowName": "={{ $workflow.name }}"
    }
  }
}
```

## Troubleshooting

- Connection refused: use `host.docker.internal` when n8n is in Docker.
- `Topic is required`: verify the JSON body and expression.
- Provider error: verify API keys and provider quota.
- Duplicate execution ID: use `n8n-{{$execution.id}}`.
