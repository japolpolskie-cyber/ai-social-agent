require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const facebookRoutes = require('./routes/facebook.routes');
const aiRoutes = require('./routes/ai.routes');
const linkedinRoutes = require('./routes/linkedin.routes');
const versionRoutes = require('./routes/version.routes');
const providersRoutes = require('./routes/providers.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'AI Social Agent is running',
  });
});

app.use('/health', healthRoutes);
app.use('/facebook', facebookRoutes);
app.use('/linkedin', linkedinRoutes);
app.use('/version', versionRoutes);
app.use('/providers', providersRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI Social Agent running at http://localhost:${PORT}`);
});