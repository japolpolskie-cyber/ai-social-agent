// ======================================================
// Pipeline Subscriber Registration
// ======================================================

const applicationLogger = require(
  "../applicationLogger"
);

const pipelineEventBus = require(
  "./events/pipelineEventBus"
);

const {
  createPipelineLoggerSubscriber,
} = require(
  "./subscribers/pipelineLoggerSubscriber"
);

let registration = null;

function registerSubscriber(subscriber) {
  if (
    !subscriber ||
    !Array.isArray(subscriber.events) ||
    typeof subscriber.handle !== "function"
  ) {
    throw new TypeError(
      "Invalid pipeline subscriber."
    );
  }

  return subscriber.events.map((eventName) =>
    pipelineEventBus.subscribe(
      eventName,
      subscriber.handle
    )
  );
}

function registerPipelineSubscribers({
  logger = applicationLogger,
} = {}) {
  if (registration) {
    return registration;
  }

  const subscribers = [
    createPipelineLoggerSubscriber({
      logger,
    }),
  ];

  const unsubscribeFunctions =
    subscribers.flatMap(registerSubscriber);

  registration = {
    subscribers: subscribers.map(
      (subscriber) => subscriber.name
    ),

    unsubscribe() {
      unsubscribeFunctions.forEach(
        (unsubscribe) => unsubscribe()
      );

      registration = null;
    },
  };

  return registration;
}

function arePipelineSubscribersRegistered() {
  return registration !== null;
}

module.exports = {
  registerPipelineSubscribers,
  arePipelineSubscribersRegistered,
};