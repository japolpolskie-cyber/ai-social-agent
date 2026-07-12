// ======================================================
// Execution Details Workspace
// ======================================================

const EXECUTIONS_ENDPOINT =
  "/executions";

const elements = {
  executionTitle:
    document.getElementById(
      "executionTitle"
    ),

  executionSubtitle:
    document.getElementById(
      "executionSubtitle"
    ),

  replayButton:
    document.getElementById(
      "replayButton"
    ),

  statusValue:
    document.getElementById(
      "statusValue"
    ),

  pipelineValue:
    document.getElementById(
      "pipelineValue"
    ),

  durationValue:
    document.getElementById(
      "durationValue"
    ),

  providerValue:
    document.getElementById(
      "providerValue"
    ),

  executionId:
    document.getElementById(
      "executionId"
    ),

  model:
    document.getElementById(
      "model"
    ),

  startedAt:
    document.getElementById(
      "startedAt"
    ),

  completedAt:
    document.getElementById(
      "completedAt"
    ),

  timeline:
    document.getElementById(
      "timeline"
    ),

  promptBox:
    document.getElementById(
      "promptBox"
    ),

  outputBox:
    document.getElementById(
      "outputBox"
    ),

  jsonBox:
    document.getElementById(
      "jsonBox"
    ),
};

const state = {
  executionId:
    null,

  execution:
    null,

  replaying:
    false,
};

// ======================================================
// Utility Helpers
// ======================================================

function normalizeText(
  value
) {
  return String(
    value ?? ""
  ).trim();
}

function formatDuration(
  milliseconds
) {
  const value =
    Number(
      milliseconds
    );

  if (
    !Number.isFinite(value) ||
    value < 0
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

function formatDate(
  value
) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      value
    );

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
          "medium",
      }
    )
    .format(
      date
    );
}

function formatJSON(
  value
) {
  if (
    value === undefined ||
    value === null
  ) {
    return "Not available.";
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  try {
    return JSON.stringify(
      value,
      null,
      2
    );
  } catch {
    return String(
      value
    );
  }
}

function getExecutionIdFromURL() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const executionId =
    normalizeText(
      params.get(
        "id"
      )
    );

  return executionId ||
    null;
}

function resolveExecutionFromResponse(
  data
) {
  return (
    data?.execution ||
    data?.data?.execution ||
    null
  );
}

function resolveStatusClass(
  status
) {
  const normalized =
    normalizeText(
      status
    ).toLowerCase();

  if (
    normalized ===
    "success"
  ) {
    return "status-success";
  }

  if (
    normalized ===
    "failed"
  ) {
    return "status-failed";
  }

  return "status-running";
}

function resolveProvider(
  execution
) {
  return (
    execution?.metadata
      ?.provider ||
    execution?.metadata
      ?.routeProvider ||
    execution?.requestSnapshot
      ?.input
      ?.provider ||
    "—"
  );
}

function resolveModel(
  execution
) {
  return (
    execution?.metadata
      ?.model ||
    execution?.metadata
      ?.routeModel ||
    "—"
  );
}

function resolvePrompt(
  execution
) {
  const snapshot =
    execution
      ?.requestSnapshot;

  if (
    snapshot?.input
  ) {
    return {
      source:
        "Request snapshot input",

      value:
        snapshot.input,
    };
  }

  return {
    source:
      "Unavailable",

    value:
      "The execution resource does not currently store the generated prompt.",
  };
}

function resolveOutput(
  execution
) {
  const possibleOutput =
    execution?.output ||
    execution?.result ||
    execution?.response ||
    execution?.metadata
      ?.output;

  if (
    possibleOutput !==
      undefined &&
    possibleOutput !==
      null
  ) {
    return possibleOutput;
  }

  return (
    "The execution resource does not currently store the generated output. " +
    "The full persisted execution record contains runtime metadata, stages, " +
    "request snapshot, and errors."
  );
}

// ======================================================
// API
// ======================================================

async function requestJSON(
  url,
  options = {}
) {
  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            "application/json",

          ...(
            options.body
              ? {
                  "Content-Type":
                    "application/json",
                }
              : {}
          ),

          ...(
            options.headers ||
            {}
          ),
        },

        ...options,
      }
    );

  let data;

  try {
    data =
      await response.json();
  } catch {
    throw new Error(
      "Server returned an invalid response."
    );
  }

  if (
    !response.ok ||
    data.success ===
      false
  ) {
    throw new Error(
      data.error?.message ||
      data.error ||
      `Request failed with status ${response.status}.`
    );
  }

  return data;
}

// ======================================================
// Loading and Error States
// ======================================================

function setReplayLoading(
  loading
) {
  state.replaying =
    loading;

  elements.replayButton
    .disabled =
      loading;

  elements.replayButton
    .textContent =
      loading
        ? "Replaying..."
        : "Replay";
}

function renderPageError(
  message
) {
  elements.executionTitle
    .textContent =
      "Execution unavailable";

  elements.executionSubtitle
    .textContent =
      message;

  elements.statusValue
    .textContent =
      "Error";

  elements.statusValue
    .className =
      "status-failed";

  elements.pipelineValue
    .textContent =
      "—";

  elements.durationValue
    .textContent =
      "—";

  elements.providerValue
    .textContent =
      "—";

  elements.executionId
    .textContent =
      state.executionId ||
      "—";

  elements.model
    .textContent =
      "—";

  elements.startedAt
    .textContent =
      "—";

  elements.completedAt
    .textContent =
      "—";

  elements.timeline
    .innerHTML = `
      <div class="page-message page-message-error">
        ${message}
      </div>
    `;

  elements.promptBox
    .textContent =
      "Unavailable.";

  elements.outputBox
    .textContent =
      "Unavailable.";

  elements.jsonBox
    .textContent =
      "Unavailable.";

  elements.replayButton
    .disabled =
      true;
}

// ======================================================
// Timeline
// ======================================================

function normalizeStageMetrics(
  execution
) {
  if (
    Array.isArray(
      execution.stageMetrics
    )
  ) {
    return execution.stageMetrics;
  }

  return [];
}

function renderTimeline(
  execution
) {
  const metrics =
    normalizeStageMetrics(
      execution
    );

  if (
    metrics.length ===
    0
  ) {
    const completedStages =
      Array.isArray(
        execution.completedStages
      )
        ? execution.completedStages
        : [];

    if (
      completedStages.length ===
      0
    ) {
      elements.timeline
        .innerHTML = `
          <div class="page-message">
            No stage timeline is available.
          </div>
        `;

      return;
    }

    elements.timeline
      .innerHTML =
        completedStages
          .map(
            (stage) => `
              <div class="timeline-item timeline-success">
                <span class="timeline-indicator"></span>

                <div class="timeline-main">
                  <p class="timeline-title">
                    ${normalizeText(stage)}
                  </p>

                  <p class="timeline-meta">
                    Completed
                  </p>
                </div>

                <span class="timeline-duration">
                  —
                </span>
              </div>
            `
          )
          .join("");

    return;
  }

  elements.timeline
    .innerHTML =
      metrics
        .map(
          (metric) => {
            const status =
              normalizeText(
                metric.status ||
                "unknown"
              ).toLowerCase();

            const statusClass =
              resolveStatusClass(
                status
              );

            return `
              <div class="timeline-item ${statusClass.replace(
                "status-",
                "timeline-"
              )}">
                <span class="timeline-indicator"></span>

                <div class="timeline-main">
                  <p class="timeline-title">
                    ${normalizeText(
                      metric.stage ||
                      "Unknown stage"
                    )}
                  </p>

                  <p class="timeline-meta">
                    ${status}
                    · ${formatDate(
                      metric.startedAt
                    )}
                  </p>
                </div>

                <span class="timeline-duration">
                  ${formatDuration(
                    metric.duration
                  )}
                </span>
              </div>
            `;
          }
        )
        .join("");
}

// ======================================================
// Rendering
// ======================================================

function renderExecution(
  execution
) {
  state.execution =
    execution;

  const status =
    normalizeText(
      execution.status ||
      "unknown"
    );

  const metadata =
    execution.metadata &&
    typeof execution.metadata ===
      "object"
      ? execution.metadata
      : {};

  const prompt =
    resolvePrompt(
      execution
    );

  elements.executionTitle
    .textContent =
      execution.executionId ||
      state.executionId ||
      "Execution";

  elements.executionSubtitle
    .textContent =
      `${execution.pipeline || "Unknown pipeline"} · ${status}`;

  elements.statusValue
    .textContent =
      status;

  elements.statusValue
    .className =
      resolveStatusClass(
        status
      );

  elements.pipelineValue
    .textContent =
      execution.pipeline ||
      "—";

  elements.durationValue
    .textContent =
      formatDuration(
        execution.duration
      );

  elements.providerValue
    .textContent =
      resolveProvider(
        execution
      );

  elements.executionId
    .textContent =
      execution.executionId ||
      "—";

  elements.model
    .textContent =
      resolveModel(
        execution
      );

  elements.startedAt
    .textContent =
      formatDate(
        execution.startedAt
      );

  elements.completedAt
    .textContent =
      formatDate(
        execution.completedAt
      );

  renderTimeline(
    execution
  );

  elements.promptBox
    .textContent =
      `${prompt.source}\n\n${formatJSON(
        prompt.value
      )}`;

  elements.outputBox
    .textContent =
      formatJSON(
        resolveOutput(
          execution
        )
      );

  elements.jsonBox
    .textContent =
      formatJSON(
        execution
      );

  document.title =
    `${execution.executionId || "Execution"} | AI Social Agent`;

  elements.replayButton
    .disabled =
      !execution.requestSnapshot;

  if (
    !execution.requestSnapshot
  ) {
    elements.replayButton
      .title =
        "This execution does not contain a replayable request snapshot.";
  } else {
    elements.replayButton
      .removeAttribute(
        "title"
      );
  }

  if (
    metadata.replayedFrom
  ) {
    elements.executionSubtitle
      .textContent +=
        ` · Replayed from ${metadata.replayedFrom}`;
  }
}

// ======================================================
// Load Execution
// ======================================================

async function loadExecution() {
  state.executionId =
    getExecutionIdFromURL();

  if (
    !state.executionId
  ) {
    renderPageError(
      "No execution ID was supplied. Open this page using execution-details.html?id=<execution-id>."
    );

    return;
  }

  try {
    const data =
      await requestJSON(
        `${EXECUTIONS_ENDPOINT}/${encodeURIComponent(
          state.executionId
        )}`
      );

    const execution =
      resolveExecutionFromResponse(
        data
      );

    if (!execution) {
      throw new Error(
        "Execution details were not found in the response."
      );
    }

    renderExecution(
      execution
    );
  } catch (error) {
    renderPageError(
      error.message ||
      "Execution details could not be loaded."
    );
  }
}

// ======================================================
// Replay
// ======================================================

async function replayExecution() {
  if (
    !state.executionId ||
    state.replaying
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      `Replay execution "${state.executionId}"?`
    );

  if (!confirmed) {
    return;
  }

  setReplayLoading(
    true
  );

  try {
    const data =
      await requestJSON(
        `${EXECUTIONS_ENDPOINT}/${encodeURIComponent(
          state.executionId
        )}/replay`,
        {
          method:
            "POST",

          body:
            JSON.stringify({
              metadata: {
                requestedBy:
                  "execution-details-workspace",

                sourceFeature:
                  "execution-details-ui",
              },
            }),
        }
      );

    const newExecutionId =
      data.newExecutionId ||
      data.execution
        ?.meta
        ?.executionId ||
      null;

    if (!newExecutionId) {
      window.alert(
        "Replay completed, but the new execution ID was not returned."
      );

      return;
    }

    const openNewExecution =
      window.confirm(
        `Replay completed.\n\nNew execution: ${newExecutionId}\n\nOpen the new execution now?`
      );

    if (
      openNewExecution
    ) {
      window.location.href =
        `/execution-details.html?id=${encodeURIComponent(
          newExecutionId
        )}`;
    }
  } catch (error) {
    window.alert(
      `Replay failed: ${error.message}`
    );
  } finally {
    setReplayLoading(
      false
    );
  }
}

// ======================================================
// Events
// ======================================================

elements.replayButton
  .addEventListener(
    "click",
    replayExecution
  );

document.addEventListener(
  "DOMContentLoaded",
  loadExecution
);
