// ======================================================
// Pipeline Metadata Model
// ======================================================

const ALLOWED_VISIBILITY = new Set([
  "public",
  "internal",
  "private",
]);

function normalizeOptionalString(
  value,
  field,
  fallback = ""
) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value !== "string") {
    throw new TypeError(
      `Pipeline metadata "${field}" must be a string.`
    );
  }

  return value.trim();
}

function normalizeBoolean(
  value,
  field,
  fallback
) {
  if (value === undefined) {
    return fallback;
  }

  if (typeof value !== "boolean") {
    throw new TypeError(
      `Pipeline metadata "${field}" must be a boolean.`
    );
  }

  return value;
}

function normalizeTags(tags = []) {
  if (!Array.isArray(tags)) {
    throw new TypeError(
      'Pipeline metadata "tags" must be an array.'
    );
  }

  const normalizedTags = tags.map(
    (tag, index) => {
      if (
        typeof tag !== "string" ||
        tag.trim().length === 0
      ) {
        throw new TypeError(
          `Pipeline metadata tag at index ${index} must be a non-empty string.`
        );
      }

      return tag.trim();
    }
  );

  return Object.freeze([
    ...new Set(normalizedTags),
  ]);
}

function normalizeVisibility(value) {
  const visibility =
    normalizeOptionalString(
      value,
      "visibility",
      "internal"
    );

  if (!ALLOWED_VISIBILITY.has(visibility)) {
    throw new TypeError(
      `Pipeline metadata "visibility" must be one of: ${[
        ...ALLOWED_VISIBILITY,
      ].join(", ")}.`
    );
  }

  return visibility;
}

function createPipelineMetadata({
  category = "general",
  tags = [],
  reusable = false,
  experimental = false,
  deprecated = false,
  visibility = "internal",
} = {}) {
  const normalizedCategory =
    normalizeOptionalString(
      category,
      "category",
      "general"
    );

  if (!normalizedCategory) {
    throw new TypeError(
      'Pipeline metadata "category" cannot be empty.'
    );
  }

  return Object.freeze({
    category: normalizedCategory,

    tags: normalizeTags(tags),

    reusable: normalizeBoolean(
      reusable,
      "reusable",
      false
    ),

    experimental: normalizeBoolean(
      experimental,
      "experimental",
      false
    ),

    deprecated: normalizeBoolean(
      deprecated,
      "deprecated",
      false
    ),

    visibility:
      normalizeVisibility(visibility),
  });
}

module.exports = {
  createPipelineMetadata,
};