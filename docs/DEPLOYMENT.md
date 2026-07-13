# Deployment Notes

## Before Deployment

```bash
npm test
npm run test:all
```

Confirm:

- `.env` is not committed
- production API keys are configured
- `API_AUTH_ENABLED=true` and `AI_SOCIAL_AGENT_API_KEY` is a long random secret
- `CORS_ORIGINS` contains only trusted browser origins
- `DB_FILE` points to persistent storage
- SQLite database is backed up
- `/health` and `/monitoring` work

## Recommended Stack

- Linux VPS
- Node.js 24+
- PM2 or systemd
- Nginx
- HTTPS
- persistent `database/` storage

## PM2

```bash
pm2 start server.js --name ai-social-agent
pm2 save
```

## Persistent Database

```text
database/ai-social-agent.db
```

## Required Before Public Exposure

- security headers
- rate limiting
- restricted CORS
- request body limits
- authentication or API key protection
- graceful shutdown
- production-safe error responses
- log rotation

## Readiness

`GET /health` does not require API authentication. It returns HTTP 200 only
when SQLite answers a probe query and HTTP 503 when the database is unavailable.
The container image uses this endpoint for its built-in health check.
