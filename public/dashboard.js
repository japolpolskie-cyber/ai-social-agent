// ======================================================
// Dashboard UI
// ======================================================

const DASHBOARD_ENDPOINT =
  "/dashboard";

// ======================================================
// DOM References
// ======================================================

const elements = {
  dashboardContent:
    document.getElementById(
      "dashboardContent"
    ),

  errorPanel:
    document.getElementById(
      "errorPanel"
    ),

  errorMessage:
    document.getElementById(
      "errorMessage"
    ),

  retryButton:
    document.getElementById(
      "retryButton"
    ),

  refreshButton:
    document.getElementById(
      "refreshButton"
    ),

  systemStatus:
    document.getElementById(
      "systemStatus"
    ),

  systemStatusText:
    document.getElementById(
      "systemStatusText"
    ),

  lastUpdated:
    document.getElementById(
      "lastUpdated"
    ),

  serviceName:
    document.getElementById(
      "serviceName"
    ),

  serviceVersion:
    document.getElementById(
      "serviceVersion"
    ),

  environment:
    document.getElementById(
      "environment"
    ),

  storeType:
    document.getElementById(
      "storeType"
    ),

  totalExecutions:
    document.getElementById(
      "totalExecutions"
    ),

  successfulExecutions:
    document.getElementById(
      "successfulExecutions"
    ),

  failedExecutions:
    document.getElementById(
      "failedExecutions"
    ),

  successRate:
    document.getElementById(
      "successRate"
    ),

  averageDuration:
    document.getElementById(
      "averageDuration"
    ),

  providerCount:
    document.getElementById(
      "providerCount"
    ),

  providersList:
    document.getElementById(
      "providersList"
    ),

  pipelineCount:
    document.getElementById(
      "pipelineCount"
    ),

  pipelinesList:
    document.getElementById(
      "pipelinesList"
    ),

  executionsTableBody:
    document.getElementById(
      "executionsTableBody"
    ),
};

// ======================================================
// Utility Helpers
// ======================================================

function escapeHTML(value) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}

function formatNumber(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "0";
  }

  return new Intl
    .NumberFormat()
    .format(number);
}

function formatPercentage(value) {
  const number =
    Number(value);

  if (
    !Number.isFinite(number)
  ) {
    return "0%";
  }

  return `${number.toFixed(
    number % 1 === 0
      ? 0
      : 2
  )}%`;
}

function formatDuration(
  milliseconds
) {
  const value =
    Number(milliseconds);

  if (
    !Number.isFinite(value)
  ) {
    return "0 ms";
  }

  if (value < 1000) {
    return `${Math.round(
      value
    )} ms`;
  }

  return `${(
    value /
    1000
  ).toFixed(2)} s`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return new Intl
    .DateTimeFormat(
      undefined,
      {
        dateStyle:
          "medium",

        timeStyle:
          "short",
      }
    )
    .format(date);
}

function capitalize(value) {
  const text =
    String(
      value ||
      ""
    );

  if (!text) {
    return "Unknown";
  }

  return (
    text.charAt(0)
      .toUpperCase() +
    text.slice(1)
  );
}

// ======================================================
// Loading State
// ======================================================

function setLoading(
  loading
) {
  elements.refreshButton.disabled =
    loading;

  elements.refreshButton.textContent =
    loading
      ? "Refreshing..."
      : "Refresh";
}

// ======================================================
// Error State
// ======================================================

function showError(error) {
  elements.errorPanel.classList
    .remove(
      "hidden"
    );

  elements.errorMessage.textContent =
    error?.message ||
    "The dashboard could not load.";
}

function clearError() {
  elements.errorPanel.classList
    .add(
      "hidden"
    );
}

// ======================================================
// System Status */
/* ====================================================== */

function renderSystemStatus(
  status
) {
  const normalizedStatus =
    String(
      status ||
      "unknown"
    ).toLowerCase();

  elements.systemStatus.className =
    "status-badge";

  if (
    normalizedStatus ===
    "healthy"
  ) {
    elements.systemStatus
      .classList.add(
        "status-healthy"
      );
  } else if (
    normalizedStatus ===
    "degraded"
  ) {
    elements.systemStatus
      .classList.add(
        "status-degraded"
      );
  } else {
    elements.systemStatus
      .classList.add(
        "status-unhealthy"
      );
  }

  elements.systemStatusText
    .textContent =
      capitalize(
        normalizedStatus
      );
}

// ======================================================
// Overview */
/* ====================================================== */

function renderOverview(
  dashboard
) {
  const overview =
    dashboard.overview ||
    {};

  const monitoring =
    dashboard.monitoring ||
    {};

  const store =
    monitoring.store ||
    {};

  elements.serviceName.textContent =
    overview.service ||
    "AI Social Agent";

  elements.serviceVersion.textContent =
    overview.version ||
    "—";

  elements.environment.textContent =
    capitalize(
      overview.environment ||
      "unknown"
    );

  elements.storeType.textContent =
    `${capitalize(
      store.type ||
      "unknown"
    )}${
      store.persistent
        ? " · Persistent"
        : " · Temporary"
    }`;

  elements.lastUpdated.textContent =
    `Updated ${formatDate(
      monitoring.system
        ?.timestamp
    )}`;

  renderSystemStatus(
    overview.status
  );
}

// ======================================================
// Execution Statistics */
/* ====================================================== */

function renderExecutionStats(
  dashboard
) {
  const executions =
    dashboard.monitoring
      ?.executions ||
    {};

  elements.totalExecutions
    .textContent =
      formatNumber(
        executions.total
      );

  elements.successfulExecutions
    .textContent =
      formatNumber(
        executions.success
      );

  elements.failedExecutions
    .textContent =
      formatNumber(
        executions.failed
      );

  elements.successRate
    .textContent =
      formatPercentage(
        executions.successRate
      );

  elements.averageDuration
    .textContent =
      formatDuration(
        executions.averageDuration
      );
}

// ======================================================
// Providers */
/* ====================================================== */

function renderProviders(
  dashboard
) {
  const providers =
    dashboard.monitoring
      ?.providers ||
    {};

  const health =
    Array.isArray(
      providers.health
    )
      ? providers.health
      : [];

  elements.providerCount
    .textContent =
      formatNumber(
        providers.count ||
        health.length
      );

  if (
    health.length === 0
  ) {
    elements.providersList.innerHTML = `
      <p class="empty-state">
        No provider information available.
      </p>
    `;

    return;
  }

  elements.providersList.innerHTML =
    health
      .map(
        (provider) => {
          const healthy =
            Boolean(
              provider.healthy
            );

          const providerName =
            escapeHTML(
              provider.name ||
              "unknown"
            );

          const model =
            escapeHTML(
              provider.defaultModel ||
              "No default model"
            );

          return `
            <div class="list-item">
              <div class="list-item-main">
                <p class="list-item-title">
                  ${providerName}
                </p>

                <p class="list-item-description">
                  Default model: ${model}
                </p>
              </div>

              <span
                class="
                  health-indicator
                  ${
                    healthy
                      ? "health-healthy"
                      : "health-unhealthy"
                  }
                "
              >
                ${
                  healthy
                    ? "Healthy"
                    : "Unavailable"
                }
              </span>
            </div>
          `;
        }
      )
      .join("");
}

// ======================================================
// Pipelines */
/* ====================================================== */

function renderPipelines(
  dashboard
) {
  const pipelineData =
    dashboard.pipelines ||
    {};

  const pipelines =
    Array.isArray(
      pipelineData.pipelines
    )
      ? pipelineData.pipelines
      : [];

  elements.pipelineCount
    .textContent =
      formatNumber(
        pipelineData.count ||
        pipelines.length
      );

  if (
    pipelines.length === 0
  ) {
    elements.pipelinesList.innerHTML = `
      <p class="empty-state">
        No pipelines registered.
      </p>
    `;

    return;
  }

  elements.pipelinesList.innerHTML =
    pipelines
      .map(
        (pipeline) => {
          const tags =
            Array.isArray(
              pipeline.tags
            )
              ? pipeline.tags
              : [];

          const tagsHTML =
            tags
              .map(
                (tag) => `
                  <span class="tag">
                    ${escapeHTML(tag)}
                  </span>
                `
              )
              .join("");

          return `
            <div class="list-item">
              <div class="list-item-main">
                <p class="list-item-title">
                  ${escapeHTML(
                    pipeline.name
                  )}
                </p>

                <p class="list-item-description">
                  ${escapeHTML(
                    pipeline.description ||
                    "No description available."
                  )}
                </p>

                <div class="pipeline-tags">
                  ${tagsHTML}
                </div>
              </div>

              <span class="count-badge">
                ${escapeHTML(
                  pipeline.version ||
                  "—"
                )}
              </span>
            </div>
          `;
        }
      )
      .join("");
}

// ======================================================
// Recent Executions */
/* ====================================================== */

function renderRecentExecutions(
  dashboard
) {
  const executions =
    Array.isArray(
      dashboard.recentExecutions
    )
      ? dashboard
          .recentExecutions
      : [];

  if (
    executions.length === 0
  ) {
    elements.executionsTableBody
      .innerHTML = `
        <tr>
          <td
            colspan="5"
            class="empty-table"
          >
            No executions recorded yet.
          </td>
        </tr>
      `;

    return;
  }

  elements.executionsTableBody
    .innerHTML =
      executions
        .map(
          (execution) => {
            const status =
              String(
                execution.status ||
                "unknown"
              ).toLowerCase();

            const statusClass =
              status === "success"
                ? "execution-success"
                : "execution-failed";

            return `
              <tr>
                <td
                  class="execution-id"
                  title="${escapeHTML(
                    execution.executionId
                  )}"
                >
                  ${escapeHTML(
                    execution.executionId
                  )}
                </td>

                <td>
                  ${escapeHTML(
                    execution.pipeline ||
                    "—"
                  )}
                </td>

                <td>
                  <span
                    class="
                      execution-status
                      ${statusClass}
                    "
                  >
                    ${escapeHTML(status)}
                  </span>
                </td>

                <td>
                  ${formatDuration(
                    execution.duration
                  )}
                </td>

                <td>
                  ${formatDate(
                    execution.startedAt
                  )}
                </td>
              </tr>
            `;
          }
        )
        .join("");
}

// ======================================================
// Full Render */
/* ====================================================== */

function renderDashboard(
  dashboard
) {
  renderOverview(
    dashboard
  );

  renderExecutionStats(
    dashboard
  );

  renderProviders(
    dashboard
  );

  renderPipelines(
    dashboard
  );

  renderRecentExecutions(
    dashboard
  );
}

// ======================================================
// Data Loading */
/* ====================================================== */

async function fetchDashboard() {
  const response =
    await fetch(
      DASHBOARD_ENDPOINT,
      {
        headers: {
          Accept:
            "application/json",
        },
      }
    );

  const data =
    await response.json();

  if (
    !response.ok ||
    data.success !== true
  ) {
    throw new Error(
      data.error?.message ||
      data.error ||
      "Dashboard request failed."
    );
  }

  return data;
}

async function loadDashboard() {
  clearError();

  setLoading(
    true
  );

  try {
    const dashboard =
      await fetchDashboard();

    renderDashboard(
      dashboard
    );
  } catch (error) {
    console.error(
      "Dashboard load failed:",
      error
    );

    showError(
      error
    );

    renderSystemStatus(
      "unhealthy"
    );
  } finally {
    setLoading(
      false
    );
  }
}

// ======================================================
// Events */
/* ====================================================== */

elements.refreshButton
  .addEventListener(
    "click",
    loadDashboard
  );

elements.retryButton
  .addEventListener(
    "click",
    loadDashboard
  );

document.addEventListener(
  "DOMContentLoaded",
  loadDashboard
);