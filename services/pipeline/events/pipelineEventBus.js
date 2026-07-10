// ======================================================
// Pipeline Event Bus
// ======================================================

const {
  isValidPipelineEvent,
} = require("./pipelineEvents");

const listeners = new Map();

function validateEventName(eventName) {
  if (!isValidPipelineEvent(eventName)) {
    throw new TypeError(
      `Unsupported pipeline event: ${eventName || "undefined"}.`
    );
  }
}

function validateListener(listener) {
  if (typeof listener !== "function") {
    throw new TypeError(
      "Pipeline event listener must be a function."
    );
  }
}

function subscribe(eventName, listener) {
  validateEventName(eventName);
  validateListener(listener);

  if (!listeners.has(eventName)) {
    listeners.set(eventName, new Set());
  }

  listeners.get(eventName).add(listener);

  return function unsubscribe() {
    return removeListener(eventName, listener);
  };
}

function removeListener(eventName, listener) {
  validateEventName(eventName);
  validateListener(listener);

  const eventListeners = listeners.get(eventName);

  if (!eventListeners) {
    return false;
  }

  const removed = eventListeners.delete(listener);

  if (eventListeners.size === 0) {
    listeners.delete(eventName);
  }

  return removed;
}

async function publish(event) {
  if (!event || typeof event !== "object") {
    return [];
  }

  if (!isValidPipelineEvent(event.name)) {
    return [];
  }

  const eventListeners = listeners.get(event.name);

  if (!eventListeners || eventListeners.size === 0) {
    return [];
  }

  const executions = Array.from(eventListeners).map(
    async (listener) => {
      try {
        await listener(event);

        return {
          status: "fulfilled",
        };
      } catch (error) {
        return {
          status: "rejected",
          error,
        };
      }
    }
  );

  return Promise.all(executions);
}

function clear(eventName = null) {
  if (eventName === null) {
    listeners.clear();
    return;
  }

  validateEventName(eventName);
  listeners.delete(eventName);
}

function listenerCount(eventName) {
  validateEventName(eventName);

  return listeners.get(eventName)?.size || 0;
}

module.exports = {
  subscribe,
  removeListener,
  publish,
  clear,
  listenerCount,
};