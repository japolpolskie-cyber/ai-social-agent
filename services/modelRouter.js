// ======================================================
// Model Router
// ======================================================

const configService = require("./configService");
const providerManager = require("./providerManager");
const modelManager = require("./modelManager");

function getRoutingConfig() {
  return configService.getRouting();
}

function getConfiguredRoute(platform, type) {
  const config = getRoutingConfig();

  return config.routes?.[platform]?.[type] || null;
}

function getDefaultRoute() {
  const config = getRoutingConfig();

  return config.defaultRoute || null;
}

function resolveRequestedRoute({
  requestedProvider,
  requestedModel,
}) {
  if (!requestedProvider && !requestedModel) {
    return null;
  }

  if (requestedModel) {
    const modelSettings =
      modelManager.getModelSettings(requestedModel);

    if (!modelSettings) {
      throw new Error(
        `Model "${requestedModel}" is not supported.`
      );
    }

    const providerName =
      requestedProvider || modelSettings.provider;

    const resolvedProvider =
      providerManager.resolveProviderName(providerName);

    const resolvedModel = modelManager.resolveModel(
      resolvedProvider,
      requestedModel
    );

    return {
      provider: resolvedProvider,
      model: resolvedModel.name,
      source: "request",
    };
  }

  const resolvedProvider =
    providerManager.resolveProviderName(requestedProvider);

  const resolvedModel = modelManager.resolveModel(
    resolvedProvider
  );

  return {
    provider: resolvedProvider,
    model: resolvedModel.name,
    source: "request",
  };
}

function resolveConfiguredRoute(platform, type) {
  const configuredRoute = getConfiguredRoute(
    platform,
    type
  );

  if (!configuredRoute) {
    return null;
  }

  const providerName =
    providerManager.resolveProviderName(
      configuredRoute.provider
    );

  const resolvedModel = modelManager.resolveModel(
    providerName,
    configuredRoute.model
  );

  return {
    provider: providerName,
    model: resolvedModel.name,
    source: "configured_route",
  };
}

function resolveDefaultRoute() {
  const defaultRoute = getDefaultRoute();

  if (!defaultRoute) {
    const providerName =
      providerManager.resolveProviderName();

    const resolvedModel =
      modelManager.resolveModel(providerName);

    return {
      provider: providerName,
      model: resolvedModel.name,
      source: "system_default",
    };
  }

  const providerName =
    providerManager.resolveProviderName(
      defaultRoute.provider
    );

  const resolvedModel = modelManager.resolveModel(
    providerName,
    defaultRoute.model
  );

  return {
    provider: providerName,
    model: resolvedModel.name,
    source: "default_route",
  };
}

function route(context) {
  if (!context) {
    throw new Error(
      "Context is required for model routing."
    );
  }

  const requestedRoute = resolveRequestedRoute({
    requestedProvider:
      context.routing?.requestedProvider,
    requestedModel:
      context.routing?.requestedModel,
  });

  if (requestedRoute) {
    return requestedRoute;
  }

  const configuredRoute = resolveConfiguredRoute(
    context.platform,
    context.type
  );

  if (configuredRoute) {
    return configuredRoute;
  }

  return resolveDefaultRoute();
}

module.exports = {
  getRoutingConfig,
  getConfiguredRoute,
  getDefaultRoute,
  resolveRequestedRoute,
  resolveConfiguredRoute,
  resolveDefaultRoute,
  route,
};