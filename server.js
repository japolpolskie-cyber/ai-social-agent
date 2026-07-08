require('dotenv').config();

const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/health.routes');
const facebookRoutes = require('./routes/facebook.routes');
const aiRoutes = require('./routes/ai.routes');
const linkedinRoutes = require('./routes/linkedin.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/ai', aiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'AI Social Agent is running',
  });
});

app.use('/health', healthRoutes);
app.use('/facebook', facebookRoutes);
app.use('/linkedin', linkedinRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 AI Social Agent running at http://localhost:${PORT}`);
});