# AI Social Agent Platform

AI Social Agent is a Node.js automation platform for generating, validating, repairing, tracking, and replaying AI-powered social media content.

## Highlights

- Gemini, Groq, and OpenRouter support
- Config-driven routing and fallback
- Reusable staged pipeline runtime
- Validation and automatic repair
- SQLite execution history
- Analytics, snapshots, replay, monitoring, and dashboard
- Dashboard, Generate, Executions, and Execution Details UI
- Safe and live-provider regression test modes
- Ready for n8n, Make, Zapier, and HTTP integrations

## Requirements

- Node.js 24+
- npm
- At least one AI provider API key

## Installation

```bash
git clone <YOUR_REPOSITORY_URL>
cd ai-social-agent
npm install
```

Copy the environment template:

```powershell
Copy-Item .env.example .env
```

Add your API keys to `.env`.

## Run

```bash
npm start
```

Pages:

- Generate: `http://localhost:3000/`
- Dashboard: `http://localhost:3000/dashboard.html`
- Executions: `http://localhost:3000/executions.html`

## Tests

```bash
npm test
npm run test:all
```

## Main API

```text
POST /ai/generate
POST /pipelines/ai-generation/execute
GET  /executions
GET  /executions/:executionId
POST /executions/:executionId/replay
GET  /executions/stats
GET  /monitoring
GET  /dashboard
```

See `docs/API.md`, `docs/ARCHITECTURE.md`, `docs/N8N.md`, and `docs/DEPLOYMENT.md`.

## n8n Quick Start

For n8n on the same machine:

```text
http://localhost:3000/ai/generate
```

For n8n running in Docker while AI Social Agent runs on Windows:

```text
http://host.docker.internal:3000/ai/generate
```

Example JSON body:

```json
{
  "platform": "facebook",
  "type": "caption",
  "topic": "How AI automation helps small businesses save time",
  "tone": "friendly",
  "audience": "small business owners",
  "provider": "openrouter"
}
```

## Status

AI Social Agent Platform v1.0.0 MVP:

- Core platform complete
- Regression suite passing
- Environment validation complete
- Local UI complete
- n8n HTTP integration ready
- Production hardening and deployment in progress

## Author

Paul Perez
