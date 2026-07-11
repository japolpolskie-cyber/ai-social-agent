// ======================================================
// Default Pipeline Runtime
// ======================================================

const {
  createPipelineRuntime,
} = require("./createPipelineRuntime");

// ======================================================
// Default Lifecycle Hooks
// ======================================================

async function initialize() {}

async function beforeExecution() {}

async function afterExecution() {}

async function cleanup() {}

// ======================================================
// Factory
// ======================================================

function createDefaultPipelineRuntime({
  createContext,
  createResult,
} = {}) {
  return createPipelineRuntime({
    createContext,
    initialize,
    beforeExecution,
    afterExecution,
    createResult,
    cleanup,
  });
}

module.exports = {
  createDefaultPipelineRuntime,
};