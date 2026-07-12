// ======================================================
// Monitoring Service
// ======================================================

const appConfig = require(
  "../../config/app"
);

const providerManager = require(
  "../providerManager"
);

const providerHealthService = require(
  "../providerHealthService"
);

const pipelineDiscoveryService = require(
  "../pipeline/pipelineDiscoveryService"
);

const executionAnalyticsService = require(
  "../pipeline/analytics/executionAnalyticsService"
);

const {
  createMonitoringSnapshot,
} = require(
  "./createMonitoringSnapshot"
);

// ======================================================
// Provider Helpers
// ======================================================

function resolveProviderNames(
  providers
) {
  if (Array.isArray(providers)) {
    return providers.map(
      (provider) => {
        if (
          typeof provider ===
          "string"
        ) {
          return provider;
        }

        return (
          provider?.name ||
          provider?.provider ||
          "unknown"
        );
      }
    );
  }

  if (
    providers &&
    typeof providers === "object"
  ) {
    return Object.keys(
      providers
    );
  }

  return [];
}

// ======================================================
// Store Helpers
// ======================================================

function getStoreInformation() {
  const type =
    (
      process.env
        .EXECUTION_STORE ||
      "sqlite"
    ).toLowerCase();

  return {
    type,

    persistent:
      type !== "memory",
  };
}

// ======================================================
// Default Dependencies
// ======================================================

const defaultDependencies = {
  async getExecutionStatistics() {
    return executionAnalyticsService
      .getExecutionStatistics();
  },

  getPipelineDiscovery() {
    return pipelineDiscoveryService
      .getAllPipelines();
  },

  getProviders() {
    return providerManager
      .listProviders();
  },

  getEnabledProviders() {
    return providerManager
      .getEnabledProviders();
  },

  getDefaultProvider() {
    return providerManager
      .getDefaultProviderName();
  },

  getProviderHealth() {
    return providerHealthService
      .checkAllProviders();
  },

  getStoreInformation,

  getServiceInformation() {
    return {
      name:
        appConfig.name,

      version:
        appConfig.version,

      environment:
        appConfig.environment,
    };
  },
};

// ======================================================
// Service Factory
// ======================================================

function createMonitoringService(
  dependencies = {}
) {
  const resolvedDependencies = {
    ...defaultDependencies,
    ...dependencies,
  };

  async function getMonitoringSnapshot() {
    const [
      executionStatistics,
      pipelineDiscovery,
      providers,
      enabledProviders,
      providerHealth,
      store,
      service,
    ] = await Promise.all([
      resolvedDependencies
        .getExecutionStatistics(),

      resolvedDependencies
        .getPipelineDiscovery(),

      resolvedDependencies
        .getProviders(),

      resolvedDependencies
        .getEnabledProviders(),

      resolvedDependencies
        .getProviderHealth(),

      resolvedDependencies
        .getStoreInformation(),

      resolvedDependencies
        .getServiceInformation(),
    ]);

    return createMonitoringSnapshot({
      service,

      executions:
        executionStatistics,

      providers: {
        default:
          resolvedDependencies
            .getDefaultProvider(),

        all:
          resolveProviderNames(
            providers
          ),

        enabled:
          resolveProviderNames(
            enabledProviders
          ),

        health:
          Array.isArray(
            providerHealth
          )
            ? providerHealth
            : Object.entries(
                providerHealth ||
                {}
              ).map(
                ([
                  name,
                  health,
                ]) => ({
                  name,

                  ...(
                    health &&
                    typeof health ===
                      "object"
                      ? health
                      : {
                          status:
                            health,
                        }
                  ),
                })
              ),
      },

      pipelines: {
        registered:
          pipelineDiscovery.count,

        items:
          pipelineDiscovery.pipelines,
      },

      store,
    });
  }

  return Object.freeze({
    getMonitoringSnapshot,
  });
}

// ======================================================
// Default Service
// ======================================================

const monitoringService =
  createMonitoringService();

module.exports = {
  createMonitoringService,

  getMonitoringSnapshot:
    monitoringService
      .getMonitoringSnapshot,
};