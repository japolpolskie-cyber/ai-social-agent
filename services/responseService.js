function success(res, data = {}) {
  return res.json({
    success: true,
    ...data,
  });
}

function error(res, error, statusCode = 500) {
  console.error('❌ Error:', error);

  return res.status(statusCode).json({
    success: false,
    error: error.message || String(error),
  });
}

module.exports = {
  success,
  error,
};