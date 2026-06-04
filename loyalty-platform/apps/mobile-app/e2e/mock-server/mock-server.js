const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.MOCK_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

const routesPath = path.join(__dirname, 'routes.json');
const routes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));

const registeredRoutes = [];

Object.entries(routes).forEach(([routePath, config]) => {
  const method = (config.method || 'GET').toLowerCase();
  const responseData = config.response;
  const statusCode = config.statusCode || 200;

  app[method](routePath, (_req, res) => {
    console.log(`[MOCK] ${method.toUpperCase()} ${routePath}`);
    if (config.delay) {
      const delayMs = typeof config.delay === 'number' ? config.delay : 100;
      setTimeout(() => res.status(statusCode).json(responseData), delayMs);
    } else {
      res.status(statusCode).json(responseData);
    }
  });

  registeredRoutes.push(`${method.toUpperCase()} ${routePath}`);
});

app.get('/__admin/routes', (_req, res) => {
  res.json({ routes: registeredRoutes });
});

app.post('/__admin/reset', (_req, res) => {
  const freshRoutes = JSON.parse(fs.readFileSync(routesPath, 'utf-8'));
  res.json({ message: 'Routes reloaded', count: Object.keys(freshRoutes).length });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Mock route not found', message: 'No matching mock route defined' });
});

app.listen(PORT, () => {
  console.log(`\n  🎭 E2E Mock Server running at http://localhost:${PORT}`);
  console.log(`  ${registeredRoutes.length} mock routes registered:\n`);
  registeredRoutes.forEach(r => console.log(`    ${r}`));
  console.log('\n');
});
