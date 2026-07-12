// ======================================================
// Monitoring Snapshot Builder
// ======================================================

// ======================================================
// Helpers
// ======================================================

function normalizeObject(
  value
) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return {};
  }

  return {
    ...value,
  };
}

function normalizeArray(
  value
) {
  return Array.isArray(value)
    ? [...value]
    : [];
}

function normalizeCount(
  value
) {
  return (
    Number.isInteger(value) &&
    value >= 0
  )
    ? value
    : 0;
}

function normalizeStoreType(
  value
) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return "unknown";
  }

  return value
    .trim()
    .toLowerCase();
}

function freezeItems(
  items
) {
  return Object.freeze(
    items.map(
      (item) => {
        if (
          item &&
          typeof item === "object"
        ) {
          return Object.freeze({
            ...item,
          });
        }

        return item;
      }
    )
  );
}

// ======================================================
// Health Resolution
// ======================================================

function isProviderHealthy(
  provider
) {
  if (
    !provider ||
    typeof provider !== "object"
  ) {
    return false;
  }

  if (
    typeof provider.healthy ===
    "boolean"
  ) {
    return provider.healthy;
  }

  if (
    typeof provider.available ===
    "boolean"
  ) {
    return provider.available;
  }

  if (
    typeof provider.status ===
    "string"
  ) {
    return [
      "healthy",
      "available",
      "ok",
      "ready",
      "up",
    ].includes(
      provider.status
        .toLowerCase()
    );
  }

  return false;
}

function resolveSystemStatus({
  executions,
  providers,
} = {}) {
  const failed =
    executions.failed ||
    0;

  const providerHealth =
    normalizeArray(
      providers.health
    );

  const healthyProviders =
    providerHealth.filter(
      isProviderHealthy
    ).length;

  if (
    providerHealth.length > 0 &&
    healthyProviders === 0
  ) {
    return "unhealthy";
  }

  if (
    failed > 0 ||
    (
      providerHealth.length > 0 &&
      healthyProviders <
        providerHealth.length
    )
  ) {
    return "degraded";
  }

  return "healthy";
}

// ======================================================
// Builder
// ======================================================

function createMonitoringSnapshot({
  service = {},
  executions = {},
  providers = {},
  pipelines = {},
  store = {},
} = {}) {
  const normalizedExecutions = {
    total:
      normalizeCount(
        executions.total
      ),

    success:
      normalizeCount(
        executions.success
      ),

    failed:
      normalizeCount(
        executions.failed
      ),

    successRate:
      typeof executions.successRate ===
        "number"
        ? executions.successRate
        : 0,

    failureRate:
      typeof executions.failureRate ===
        "number"
        ? executions.failureRate
        : 0,

    averageDuration:
      typeof executions.averageDuration ===
        "number"
        ? executions.averageDuration
        : 0,
  };

  const enabledProviders =
    normalizeArray(
      providers.enabled
    );

  const allProviders =
    normalizeArray(
      providers.all
    );

  const providerHealth =
    normalizeArray(
      providers.health
    );

  const normalizedProviders = {
    default:
      providers.default ||
      null,

    enabled:
      Object.freeze([
        ...enabledProviders,
      ]),

    count:
      enabledProviders.length,

    available:
      Object.freeze([
        ...allProviders,
      ]),

    health:
      freezeItems(
        providerHealth
      ),
  };

  const normalizedPipelines = {
    registered:
      normalizeCount(
        pipelines.registered
      ),

    items:
      freezeItems(
        normalizeArray(
          pipelines.items
        )
      ),
  };

  const normalizedStore = {
    type:
      normalizeStoreType(
        store.type
      ),

    persistent:
      Boolean(
        store.persistent
      ),
  };

  const status =
    resolveSystemStatus({
      executions:
        normalizedExecutions,

      providers:
        normalizedProviders,
    });

  return Object.freeze({
    system:
      Object.freeze({
        status,

        service:
          service.name ||
          "AI Social Agent",

        version:
          service.version ||
          "1.0.0",

        environment:
          service.environment ||
          process.env.NODE_ENV ||
          "development",

        timestamp:
          new Date()
            .toISOString(),
      }),

    executions:
      Object.freeze(
        normalizedExecutions
      ),

    providers:
      Object.freeze(
        normalizedProviders
      ),

    pipelines:
      Object.freeze(
        normalizedPipelines
      ),

    store:
      Object.freeze(
        normalizedStore
      ),
  });
}

module.exports = {
  createMonitoringSnapshot,
};