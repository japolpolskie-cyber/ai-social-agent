# Architecture

## Request Flow

```text
HTTP/UI
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
Pipeline Execution Service
  ↓
Runtime + Stages
  ↓
Provider Router + Fallback
  ↓
Validation + Repair
  ↓
Execution Store + Analytics + Replay
```

## AI Generation Stages

1. `validate-input`
2. `build-context`
3. `route-model`
4. `build-prompt`
5. `execute-ai`
6. `process-output`

## Core Modules

- pipeline definitions, registry, catalog, and resolver
- runtime lifecycle manager and execution engine
- execution records and request snapshots
- SQLite-backed execution store
- query, analytics, monitoring, and dashboard services
- replay through the same execution service

## Design Rules

1. Reuse existing capabilities before creating new ones.
2. Keep controllers thin.
3. Keep persistence behind store/query services.
4. Use one execution path for API execution and replay.
5. Validate contracts early and fail fast.

## Production Boundaries

- API-key authentication is an opt-in middleware boundary around application,
  operational, pipeline, and execution APIs. Health and version probes remain
  public.
- `/health` is a readiness endpoint: it verifies SQLite with a real query and
  returns HTTP 503 when persistence is unavailable.
- SQLite uses the configured `DB_FILE`, WAL journaling, foreign-key enforcement,
  and a busy timeout. The connection is closed during graceful shutdown.
- Controllers may return detailed failures during development, while unexpected
  server errors are redacted in production and retained in structured logs.
