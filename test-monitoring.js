// ======================================================
// Monitoring Capability Test
// ======================================================

const assert = require(
  "node:assert"
);

const {
  createMonitoringService,
} = require(
  "./services/monitoring/monitoringService"
);

// ======================================================
// Healthy Snapshot
// ======================================================

async function testHealthySnapshot() {
  const service =
    createMonitoringService({
      async getExecutionStatistics() {
        return {
          total:
            10,

          success:
            10,

          failed:
            0,

          successRate:
            100,

          failureRate:
            0,

          averageDuration:
            500,
        };
      },

      getPipelineDiscovery() {
        return {
          count:
            1,

          pipelines: [
            {
              name:
                "ai-generation",

              version:
                "1.0.0",
            },
          ],
        };
      },

      getProviders() {
        return [
          "gemini",
          "groq",
          "openrouter",
        ];
      },

      getEnabledProviders() {
        return [
          "gemini",
          "groq",
          "openrouter",
        ];
      },

      getDefaultProvider() {
        return "gemini";
      },

      getProviderHealth() {
        return [
          {
            name:
              "gemini",

            healthy:
              true,
          },

          {
            name:
              "groq",

            healthy:
              true,
          },

          {
            name:
              "openrouter",

            healthy:
              true,
          },
        ];
      },

      getStoreInformation() {
        return {
          type:
            "sqlite",

          persistent:
            true,
        };
      },

      getServiceInformation() {
        return {
          name:
            "AI Social Agent",

          version:
            "1.0.0",

          environment:
            "test",
        };
      },
    });

  const monitoring =
    await service
      .getMonitoringSnapshot();

  assert.strictEqual(
    monitoring.system.status,
    "healthy"
  );

  assert.strictEqual(
    monitoring.executions.total,
    10
  );

  assert.strictEqual(
    monitoring.providers.count,
    3
  );

  assert.strictEqual(
    monitoring.pipelines.registered,
    1
  );

  assert.strictEqual(
    monitoring.store.type,
    "sqlite"
  );

  assert.strictEqual(
    monitoring.store.persistent,
    true
  );
}

// ======================================================
// Degraded Snapshot
// ======================================================

async function testDegradedSnapshot() {
  const service =
    createMonitoringService({
      async getExecutionStatistics() {
        return {
          total:
            5,

          success:
            4,

          failed:
            1,

          successRate:
            80,

          failureRate:
            20,

          averageDuration:
            800,
        };
      },

      getPipelineDiscovery() {
        return {
          count:
            1,

          pipelines:
            [],
        };
      },

      getProviders() {
        return [
          "gemini",
          "openrouter",
        ];
      },

      getEnabledProviders() {
        return [
          "gemini",
          "openrouter",
        ];
      },

      getDefaultProvider() {
        return "gemini";
      },

      getProviderHealth() {
        return [
          {
            name:
              "gemini",

            healthy:
              true,
          },

          {
            name:
              "openrouter",

            healthy:
              false,
          },
        ];
      },

      getStoreInformation() {
        return {
          type:
            "memory",

          persistent:
            false,
        };
      },

      getServiceInformation() {
        return {};
      },
    });

  const monitoring =
    await service
      .getMonitoringSnapshot();

  assert.strictEqual(
    monitoring.system.status,
    "degraded"
  );

  assert.strictEqual(
    monitoring.executions.failed,
    1
  );
}

// ======================================================
// Run
// ======================================================

async function run() {
  await testHealthySnapshot();
  await testDegradedSnapshot();

  console.log(
    "Monitoring capability tests passed."
  );
}

run().catch(
  (error) => {
    console.error(
      "Monitoring capability tests failed."
    );

    console.error(error);

    process.exitCode = 1;
  }
);