// ======================================================
// Executions Workspace
// ======================================================

const EXECUTIONS_ENDPOINT =
  "/executions";

const DEFAULT_LIMIT =
  100;

// ======================================================
// State
// ======================================================

const state = {
  executions:
    [],

  filteredExecutions:
    [],

  loading:
    false,

  replayingExecutionId:
    null,
};

// ======================================================
// DOM References
// ======================================================

const elements = {
  refreshButton:
    document.getElementById(
      "refreshButton"
    ),

  pipelineFilter:
    document.getElementById(
      "pipelineFilter"
    ),

  statusFilter:
    document.getElementById(
      "statusFilter"
    ),

  searchInput:
    document.getElementById(
      "searchInput"
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

  averageDuration:
    document.getElementById(
      "averageDuration"
    ),

  executionTable:
    document.getElementById(
      "executionTable"
    ),
};

// ======================================================
// Generic Helpers
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

function formatDuration(
  milliseconds
) {
  const value =
    Number(milliseconds);

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

function normalizeText(value) {
  return String(
    value ?? ""
  )
    .trim()
    .toLowerCase();
}

function calculateAverageDuration(
  executions
) {
  const durations =
    executions
      .map(
        (execution) =>
          Number(
            execution.duration
          )
      )
      .filter(
        (duration) =>
          Number.isFinite(
            duration
          ) &&
          duration >= 0
      );

  if (
    durations.length === 0
  ) {
    return 0;
  }

  const total =
    durations.reduce(
      (
        sum,
        duration
      ) =>
        sum +
        duration,
      0
    );

  return Math.round(
    total /
    durations.length
  );
}

// ======================================================
// Response Normalization
// ======================================================

function resolveExecutionsFromResponse(
  data
) {
  const candidates = [
    data?.executions,
    data?.history
      ?.executions,
    data?.data
      ?.executions,
    data?.executionHistory
      ?.executions,
  ];

  for (
    const candidate
    of candidates
  ) {
    if (
      Array.isArray(candidate)
    ) {
      return candidate;
    }
  }

  return [];
}

function resolveExecutionFromResponse(
  data
) {
  return (
    data?.execution ||
    data?.data?.execution ||
    data?.record ||
    null
  );
}

// ======================================================
// Request Helpers
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
    data.success === false
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
// Loading and Message States
// ======================================================

function setLoading(
  loading
) {
  state.loading =
    loading;

  elements.refreshButton.disabled =
    loading;

  elements.refreshButton.textContent =
    loading
      ? "Refreshing..."
      : "Refresh";
}

function renderMessageRow(
  message,
  className =
    "loading-row"
) {
  elements.executionTable.innerHTML = `
    <tr>
      <td
        colspan="6"
        class="${className}"
      >
        ${escapeHTML(message)}
      </td>
    </tr>
  `;
}

// ======================================================
// Filter Options
// ======================================================

function populatePipelineFilter(
  executions
) {
  const currentValue =
    elements.pipelineFilter.value;

  const pipelines =
    Array.from(
      new Set(
        executions
          .map(
            (execution) =>
              execution.pipeline
          )
          .filter(Boolean)
      )
    )
      .sort(
        (
          first,
          second
        ) =>
          String(first)
            .localeCompare(
              String(second)
            )
      );

  const options =
    pipelines
      .map(
        (pipeline) => `
          <option
            value="${escapeHTML(pipeline)}"
          >
            ${escapeHTML(pipeline)}
          </option>
        `
      )
      .join("");

  elements.pipelineFilter.innerHTML = `
    <option value="">
      All Pipelines
    </option>

    ${options}
  `;

  if (
    pipelines.includes(
      currentValue
    )
  ) {
    elements.pipelineFilter.value =
      currentValue;
  }
}

// ======================================================
// Filtering
// ======================================================

function applyFilters() {
  const selectedPipeline =
    normalizeText(
      elements.pipelineFilter
        .value
    );

  const selectedStatus =
    normalizeText(
      elements.statusFilter
        .value
    );

  const searchTerm =
    normalizeText(
      elements.searchInput
        .value
    );

  state.filteredExecutions =
    state.executions.filter(
      (execution) => {
        const pipeline =
          normalizeText(
            execution.pipeline
          );

        const status =
          normalizeText(
            execution.status
          );

        const executionId =
          normalizeText(
            execution.executionId
          );

        if (
          selectedPipeline &&
          pipeline !==
            selectedPipeline
        ) {
          return false;
        }

        if (
          selectedStatus &&
          status !==
            selectedStatus
        ) {
          return false;
        }

        if (
          searchTerm &&
          !executionId.includes(
            searchTerm
          )
        ) {
          return false;
        }

        return true;
      }
    );

  renderSummary(
    state.filteredExecutions
  );

  renderExecutions(
    state.filteredExecutions
  );
}

// ======================================================
// Summary
// ======================================================

function renderSummary(
  executions
) {
  const successful =
    executions.filter(
      (execution) =>
        normalizeText(
          execution.status
        ) ===
        "success"
    ).length;

  const failed =
    executions.filter(
      (execution) =>
        normalizeText(
          execution.status
        ) ===
        "failed"
    ).length;

  elements.totalExecutions
    .textContent =
      formatNumber(
        executions.length
      );

  elements.successfulExecutions
    .textContent =
      formatNumber(
        successful
      );

  elements.failedExecutions
    .textContent =
      formatNumber(
        failed
      );

  elements.averageDuration
    .textContent =
      formatDuration(
        calculateAverageDuration(
          executions
        )
      );
}

// ======================================================
// Execution Table
// ======================================================

function resolveStatusClass(
  status
) {
  const normalizedStatus =
    normalizeText(
      status
    );

  if (
    normalizedStatus ===
    "success"
  ) {
    return "status-success";
  }

  if (
    normalizedStatus ===
    "failed"
  ) {
    return "status-failed";
  }

  return "status-running";
}

function renderExecutions(
  executions
) {
  if (
    executions.length === 0
  ) {
    renderMessageRow(
      "No executions match the current filters.",
      "empty-row"
    );

    return;
  }

  elements.executionTable.innerHTML =
    executions
      .map(
        (execution) => {
          const executionId =
            String(
              execution.executionId ||
              ""
            );

          const status =
            normalizeText(
              execution.status ||
              "unknown"
            );

          const replaying =
            state.replayingExecutionId ===
            executionId;

          return `
            <tr>
              <td>
                <div
                  class="execution-id"
                  title="${escapeHTML(
                    executionId
                  )}"
                >
                  ${escapeHTML(
                    executionId ||
                    "—"
                  )}
                </div>
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
                    status-badge
                    ${resolveStatusClass(
                      status
                    )}
                  "
                >
                  ${escapeHTML(
                    status ||
                    "unknown"
                  )}
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

              <td>
                <div class="actions">
                  <button
                    type="button"
                    class="action-button"
                    data-action="details"
                    data-execution-id="${escapeHTML(
                      executionId
                    )}"
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    class="
                      action-button
                      action-button-replay
                    "
                    data-action="replay"
                    data-execution-id="${escapeHTML(
                      executionId
                    )}"
                    ${replaying
                      ? "disabled"
                      : ""}
                  >
                    ${replaying
                      ? "Replaying..."
                      : "Replay"}
                  </button>
                </div>
              </td>
            </tr>
          `;
        }
      )
      .join("");
}

// ======================================================
// Details Dialog
// ======================================================

function injectDialogStyles() {
  if (
    document.getElementById(
      "executionDialogStyles"
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "executionDialogStyles";

  style.textContent = `
    .execution-dialog {
      width: min(820px, calc(100% - 28px));
      max-height: 86vh;
      padding: 0;

      border:
        1px solid
        rgba(148, 163, 184, 0.24);

      border-radius: 18px;

      color: #f8fafc;
      background: #11182b;

      box-shadow:
        0 28px 90px
        rgba(0, 0, 0, 0.56);
    }

    .execution-dialog::backdrop {
      background:
        rgba(2, 6, 23, 0.78);

      backdrop-filter:
        blur(5px);
    }

    .execution-dialog-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 18px;

      padding: 20px 22px;

      border-bottom:
        1px solid
        rgba(148, 163, 184, 0.16);
    }

    .execution-dialog-header h2 {
      margin: 4px 0 0;
      font-size: 1.15rem;
    }

    .execution-dialog-label {
      margin: 0;

      color: #7c9cff;

      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.14em;
    }

    .execution-dialog-close {
      width: 36px;
      height: 36px;

      border:
        1px solid
        rgba(148, 163, 184, 0.22);

      border-radius: 9px;

      color: #cbd5e1;
      background:
        rgba(255, 255, 255, 0.04);

      cursor: pointer;
    }

    .execution-dialog-body {
      max-height: calc(86vh - 78px);
      overflow: auto;

      padding: 22px;
    }

    .execution-detail-grid {
      display: grid;
      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 12px;

      margin-bottom: 18px;
    }

    .execution-detail-card {
      padding: 14px;

      border:
        1px solid
        rgba(148, 163, 184, 0.16);

      border-radius: 11px;

      background:
        rgba(255, 255, 255, 0.025);
    }

    .execution-detail-card span {
      display: block;

      margin-bottom: 7px;

      color: #8491a7;

      font-size: 0.69rem;
      font-weight: 800;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    .execution-detail-card strong {
      display: block;

      overflow-wrap: anywhere;

      color: #f8fafc;

      font-size: 0.88rem;
    }

    .execution-json-title {
      margin: 20px 0 10px;

      color: #cbd5e1;

      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .execution-json {
      overflow: auto;

      margin: 0;
      padding: 16px;

      border:
        1px solid
        rgba(148, 163, 184, 0.16);

      border-radius: 12px;

      color: #cbd5e1;
      background: #090e1b;

      font-family:
        "Cascadia Code",
        "SFMono-Regular",
        Consolas,
        monospace;

      font-size: 0.76rem;
      line-height: 1.65;
      white-space: pre-wrap;
    }

    @media (max-width: 620px) {
      .execution-detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

function ensureDetailsDialog() {
  let dialog =
    document.getElementById(
      "executionDetailsDialog"
    );

  if (dialog) {
    return dialog;
  }

  injectDialogStyles();

  dialog =
    document.createElement(
      "dialog"
    );

  dialog.id =
    "executionDetailsDialog";

  dialog.className =
    "execution-dialog";

  dialog.innerHTML = `
    <div class="execution-dialog-header">
      <div>
        <p class="execution-dialog-label">
          EXECUTION DETAILS
        </p>

        <h2 id="executionDialogTitle">
          Loading...
        </h2>
      </div>

      <button
        type="button"
        class="execution-dialog-close"
        aria-label="Close execution details"
      >
        ×
      </button>
    </div>

    <div
      id="executionDialogBody"
      class="execution-dialog-body"
    >
      Loading execution details...
    </div>
  `;

  document.body.appendChild(
    dialog
  );

  dialog
    .querySelector(
      ".execution-dialog-close"
    )
    .addEventListener(
      "click",
      () =>
        dialog.close()
    );

  dialog.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        dialog
      ) {
        dialog.close();
      }
    }
  );

  return dialog;
}

function renderExecutionDetails(
  execution
) {
  const dialog =
    ensureDetailsDialog();

  const title =
    dialog.querySelector(
      "#executionDialogTitle"
    );

  const body =
    dialog.querySelector(
      "#executionDialogBody"
    );

  title.textContent =
    execution.executionId ||
    "Execution";

  const metadata =
    execution.metadata &&
    typeof execution.metadata ===
      "object"
      ? execution.metadata
      : {};

  body.innerHTML = `
    <div class="execution-detail-grid">
      <div class="execution-detail-card">
        <span>Pipeline</span>
        <strong>
          ${escapeHTML(
            execution.pipeline ||
            "—"
          )}
        </strong>
      </div>

      <div class="execution-detail-card">
        <span>Status</span>
        <strong>
          ${escapeHTML(
            execution.status ||
            "—"
          )}
        </strong>
      </div>

      <div class="execution-detail-card">
        <span>Duration</span>
        <strong>
          ${formatDuration(
            execution.duration
          )}
        </strong>
      </div>

      <div class="execution-detail-card">
        <span>Provider</span>
        <strong>
          ${escapeHTML(
            metadata.provider ||
            "—"
          )}
        </strong>
      </div>

      <div class="execution-detail-card">
        <span>Started</span>
        <strong>
          ${escapeHTML(
            formatDate(
              execution.startedAt
            )
          )}
        </strong>
      </div>

      <div class="execution-detail-card">
        <span>Completed</span>
        <strong>
          ${escapeHTML(
            formatDate(
              execution.completedAt
            )
          )}
        </strong>
      </div>
    </div>

    <h3 class="execution-json-title">
      Full Record
    </h3>

    <pre class="execution-json">${escapeHTML(
      JSON.stringify(
        execution,
        null,
        2
      )
    )}</pre>
  `;

  if (
    !dialog.open
  ) {
    dialog.showModal();
  }
}

// ======================================================
// Actions
// ======================================================

async function viewExecutionDetails(
  executionId
) {
  const dialog =
    ensureDetailsDialog();

  dialog.querySelector(
    "#executionDialogTitle"
  ).textContent =
    executionId;

  dialog.querySelector(
    "#executionDialogBody"
  ).textContent =
    "Loading execution details...";

  if (
    !dialog.open
  ) {
    dialog.showModal();
  }

  try {
    const data =
      await requestJSON(
        `${EXECUTIONS_ENDPOINT}/${encodeURIComponent(
          executionId
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

    renderExecutionDetails(
      execution
    );
  } catch (error) {
    dialog.querySelector(
      "#executionDialogBody"
    ).innerHTML = `
      <p class="error-row">
        ${escapeHTML(
          error.message
        )}
      </p>
    `;
  }
}

async function replayExecution(
  executionId
) {
  const confirmed =
    window.confirm(
      `Replay execution "${executionId}"?`
    );

  if (!confirmed) {
    return;
  }

  state.replayingExecutionId =
    executionId;

  renderExecutions(
    state.filteredExecutions
  );

  try {
    const data =
      await requestJSON(
        `${EXECUTIONS_ENDPOINT}/${encodeURIComponent(
          executionId
        )}/replay`,
        {
          method:
            "POST",

          body:
            JSON.stringify({
              metadata: {
                requestedBy:
                  "executions-workspace",

                sourceFeature:
                  "execution-ui",
              },
            }),
        }
      );

    const newExecutionId =
      data.newExecutionId ||
      data.execution
        ?.meta
        ?.executionId ||
      "new execution";

    window.alert(
      `Replay completed.\n\nNew execution: ${newExecutionId}`
    );

    await loadExecutions();
  } catch (error) {
    window.alert(
      `Replay failed: ${error.message}`
    );
  } finally {
    state.replayingExecutionId =
      null;

    renderExecutions(
      state.filteredExecutions
    );
  }
}

function handleTableClick(
  event
) {
  const button =
    event.target.closest(
      "[data-action]"
    );

  if (!button) {
    return;
  }

  const executionId =
    button.dataset
      .executionId;

  const action =
    button.dataset
      .action;

  if (!executionId) {
    return;
  }

  if (
    action ===
    "details"
  ) {
    window.location.href =
      `/execution-details.html?id=${encodeURIComponent(
        executionId
      )}`;

    return;
  }

  if (
    action ===
    "replay"
  ) {
    replayExecution(
      executionId
    );
  }
}

// ======================================================
// Data Loading
// ======================================================

async function loadExecutions() {
  setLoading(
    true
  );

  renderMessageRow(
    "Loading execution history..."
  );

  try {
    const query =
      new URLSearchParams({
        limit:
          String(
            DEFAULT_LIMIT
          ),

        offset:
          "0",
      });

    const data =
      await requestJSON(
        `${EXECUTIONS_ENDPOINT}?${query.toString()}`
      );

    state.executions =
      resolveExecutionsFromResponse(
        data
      );

    populatePipelineFilter(
      state.executions
    );

    applyFilters();
  } catch (error) {
    state.executions =
      [];

    state.filteredExecutions =
      [];

    renderSummary(
      []
    );

    renderMessageRow(
      error.message ||
      "Execution history could not be loaded.",
      "error-row"
    );
  } finally {
    setLoading(
      false
    );
  }
}

// ======================================================
// Events
// ======================================================

elements.refreshButton
  .addEventListener(
    "click",
    loadExecutions
  );

elements.pipelineFilter
  .addEventListener(
    "change",
    applyFilters
  );

elements.statusFilter
  .addEventListener(
    "change",
    applyFilters
  );

elements.searchInput
  .addEventListener(
    "input",
    applyFilters
  );

elements.executionTable
  .addEventListener(
    "click",
    handleTableClick
  );

document.addEventListener(
  "DOMContentLoaded",
  loadExecutions
);
