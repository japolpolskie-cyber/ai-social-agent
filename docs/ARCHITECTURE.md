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
