# Deployment Notes

## Before Deployment

```bash
npm test
npm run test:all
```

Confirm:

- `.env` is not committed
- production API keys are configured
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
